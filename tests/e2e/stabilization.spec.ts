import { expect, test, type Page } from "@playwright/test";
import type { AppState } from "../../src/domain/types";

for (const choiceCount of [4, 6]) {
  test(`${choiceCount} choices: earned stars survive reloading during feedback`, async ({ page }) => {
    await startMission(page, choiceCount);
    await answerCorrectly(page);

    await expect.poll(async () => (await readState(page)).rewards.stars).toBe(1);
    await page.reload();
    await expect(page.getByRole("heading", { name: "EdukoTable", exact: true })).toBeVisible();
    const state = await readState(page);
    expect(state.rewards.stars).toBe(1);
    expect(state.rewards.totalStarsEarned).toBe(1);
    expect(state.rewards.sessionsCompleted).toBe(0);
    expect(state.rewards.stickersUnlocked).toEqual([]);
    expect(state.rewards.challengeCardsUnlocked).toEqual([]);
    expect(Object.values(state.progress.operationStats).reduce((total, stats) => total + stats.correct, 0)).toBe(1);
  });

  test(`${choiceCount} choices: quitting pauses feedback and abandoning never credits stars twice`, async ({ page }) => {
    await startMission(page, choiceCount);
    await answerCorrectly(page);
    await page.getByRole("button", { name: "Quitter", exact: true }).click();
    await page.clock.runFor(2_000);
    await expect(page.getByText("Question 1 / 10", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Continuer", exact: true }).click();
    await page.clock.runFor(800);
    await expect(page.getByText("Question 2 / 10", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Quitter", exact: true }).click();
    await page.getByRole("button", { name: "Arrêter", exact: true }).click();
    await expect(page.getByText("Mission arrêtée", { exact: true })).toBeVisible();
    await page.clock.runFor(2_000);
    await expect(page.getByRole("dialog")).toBeHidden();
    const state = await readState(page);
    expect(state.rewards.stars).toBe(1);
    expect(state.rewards.totalStarsEarned).toBe(1);
    expect(state.rewards.sessionsCompleted).toBe(0);
    expect(state.rewards.stickersUnlocked).toEqual([]);
    expect(state.rewards.challengeCardsUnlocked).toEqual([]);
  });

  for (const decision of ["Continuer", "Arrêter"]) {
    test(`${choiceCount} choices: ${decision} on the final feedback completes exactly once`, async ({ page }) => {
      await startMission(page, choiceCount);
      for (let index = 1; index <= 10; index += 1) {
        await expect(page.getByText(`Question ${index} / 10`, { exact: true })).toBeVisible();
        await answerCorrectly(page);
        if (index < 10) await page.clock.runFor(800);
      }

      await page.getByRole("button", { name: "Quitter", exact: true }).click();
      await page.clock.runFor(2_000);
      await expect(page.getByText("Mission terminée", { exact: true })).toBeHidden();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: decision, exact: true }).click();
      await page.clock.runFor(800);
      await expect(page.getByText("Mission terminée", { exact: true })).toBeVisible();
      await expect(page.getByRole("dialog")).toBeHidden();
      await page.clock.runFor(2_000);

      const state = await readState(page);
      // 10 answers + 3 completion + 5 perfect + badges (5 + 10 + 5).
      expect(state.rewards.stars).toBe(38);
      expect(state.rewards.totalStarsEarned).toBe(38);
      expect(state.rewards.sessionsCompleted).toBe(1);
      expect(state.rewards.challengeSix.sessionsCompleted).toBe(choiceCount === 6 ? 1 : 0);
      expect(state.rewards.challengeCardsUnlocked).toEqual(choiceCount === 6 ? ["hexa-firefly"] : []);
      await page.reload();
      expect((await readState(page)).rewards).toEqual(state.rewards);
    });
  }
}

async function startMission(page: Page, choiceCount: number) {
  await page.goto("/");
  await page.clock.install({ time: new Date("2026-09-23T10:00:00Z") });
  await page.clock.pauseAt(new Date("2026-09-23T10:00:01Z"));
  await page.getByRole("button", { name: choiceCount === 6 ? "Défi 6 choix" : "Mission rapide", exact: true }).click();
  await page.getByRole("button", { name: "Commencer", exact: true }).click();
}

async function answerCorrectly(page: Page) {
  const [a, b] = (await page.locator(".operation").innerText()).split("×").map(Number);
  await page.getByRole("button", { name: `Réponse ${a * b}`, exact: true }).click();
  await expect(page.getByText("Bravo !", { exact: true })).toBeVisible();
}

async function readState(page: Page): Promise<AppState> {
  return page.evaluate(() => JSON.parse(localStorage.getItem("edukotable:v1")!));
}
