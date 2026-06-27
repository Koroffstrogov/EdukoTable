import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("home is visible", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mission rapide" })).toBeVisible();
  await expect(page.getByLabel("Eduko Prêt")).toBeVisible();
  await expect(page.locator('[data-animation-id="mascot-idle"]').first()).toBeVisible();
  await expect(page.locator(".mascot-face").first()).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("opens album and returns home", async ({ page }) => {
  await page.getByRole("button", { name: "Album" }).click();
  await expect(page.getByRole("heading", { name: "Mes stickers" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Accueil" }).click();
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
});

test("opens progression and returns home", async ({ page }) => {
  await page.getByRole("button", { name: "Progression" }).click();
  await expect(page.getByRole("heading", { name: "Progression" })).toBeVisible();
  await expect(page.getByText("Table 2")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Accueil" }).click();
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
});

test("updates settings and returns home", async ({ page }) => {
  await page.getByRole("button", { name: "Réglages" }).click();
  await expect(page.getByRole("heading", { name: "Réglages" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Animations activé" }).click();
  await expect(page.getByText("Animations désactivées.")).toBeVisible();

  await page.getByRole("button", { name: "Sons désactivé" }).click();
  await expect(page.getByText("Sons activés. Ils seront utilisés après une interaction.")).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Réglages" }).click();
  await expect(page.getByRole("button", { name: "Animations désactivé" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sons activé" })).toBeVisible();

  await page.getByRole("button", { name: "Accueil" }).click();
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
  await expect(page.locator('[data-animation-id="mascot-idle"]').first()).toHaveAttribute(
    "data-animation-state",
    "disabled",
  );
  await expect(page.locator(".mascot-face").first()).toBeVisible();
});

test("uses mascot fallback when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();

  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
  await expect(page.locator('[data-animation-id="mascot-idle"]').first()).toHaveAttribute(
    "data-animation-state",
    "reduced",
  );
  await expect(page.locator(".mascot-face").first()).toBeVisible();
});

test("starts a quick mission and shows the first question", async ({ page }) => {
  await page.getByRole("button", { name: "Mission rapide" }).click();
  await expect(page.getByRole("heading", { name: "Je révise quelles tables ?" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Commencer" }).click();
  await expect(page.getByText("Question 1 / 10")).toBeVisible();
  await expect(page.getByText("Combien font ?")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("can cancel then abandon a mission without answers", async ({ page }) => {
  await startQuickMission(page);

  await page.getByRole("button", { name: "Quitter" }).click();
  await expect(page.getByRole("dialog", { name: "Arrêter la mission ?" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Continuer" }).click();
  await expect(page.getByText("Question 1 / 10")).toBeVisible();

  await page.getByRole("button", { name: "Quitter" }).click();
  await page.getByRole("button", { name: "Arrêter" }).click();
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
});

test("shows a partial summary after abandoning answered mission", async ({ page }) => {
  await startQuickMission(page);

  const operationText = await page.locator(".operation").innerText();
  const correctAnswer = getProductFromOperation(operationText);

  await page.getByRole("button", { name: `Réponse ${correctAnswer}` }).click();
  await expect(page.getByText("+1 étoile")).toBeVisible();

  await page.getByRole("button", { name: "Quitter" }).click();
  await page.getByRole("button", { name: "Arrêter" }).click();

  await expect(page.getByText("Mission arrêtée")).toBeVisible();
  await expect(page.getByRole("heading", { name: "1 / 10 questions faites" })).toBeVisible();
  await expect(page.getByText("1 bonne réponse")).toBeVisible();
  await expect(page.getByText("Tes réponses sont enregistrées.")).toBeVisible();
  await expect(page.getByText("Pas de sticker cette fois.")).toBeVisible();
  const rewards = await getPersistedRewards(page);
  expect(rewards.sessionsCompleted).toBe(0);
  expect(rewards.stickersUnlocked).toHaveLength(0);
});

test("shows wrong feedback without relying on a fixed question", async ({ page }) => {
  await startQuickMission(page);

  const operationText = await page.locator(".operation").innerText();
  const correctAnswer = getProductFromOperation(operationText);
  const wrongAnswer = await getDisplayedWrongAnswer(page, correctAnswer);

  await page.getByRole("button", { name: `Réponse ${wrongAnswer}` }).click();

  await expect(page.getByText("Presque !")).toBeVisible();
  await expect(page.getByText("On la reverra bientôt.")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("completes a full quick mission and shows the final summary", async ({ page }) => {
  await startQuickMission(page);

  for (let index = 1; index <= 10; index += 1) {
    await expect(page.getByText(`Question ${index} / 10`)).toBeVisible();
    await answerCurrentQuestionCorrectly(page);
  }

  await expect(page.getByText("Mission terminée")).toBeVisible();
  await expect(page.getByRole("heading", { name: "10 / 10 réussies" })).toBeVisible();
  await expect(page.getByLabel("Récompenses gagnées")).toBeVisible();
  await expect(page.getByText("étoiles gagnées")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

for (const width of [320, 375, 390, 430]) {
  test(`main session path has no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/");
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "Mission rapide" }).click();
    await expect(page.getByRole("heading", { name: "Je révise quelles tables ?" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "Commencer" }).click();
    await expect(page.getByText("Question 1 / 10")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await answerCurrentQuestionCorrectly(page);
    await expectNoHorizontalOverflow(page);
  });
}

async function startQuickMission(page: Page) {
  await page.getByRole("button", { name: "Mission rapide" }).click();
  await page.getByRole("button", { name: "Commencer" }).click();
  await expect(page.getByText("Question 1 / 10")).toBeVisible();
}

async function answerCurrentQuestionCorrectly(page: Page) {
  const operationText = await page.locator(".operation").innerText();
  const correctAnswer = getProductFromOperation(operationText);
  const answerButton = page.getByRole("button", {
    name: `Réponse ${correctAnswer}`,
  });

  await expect(answerButton).toBeEnabled();
  await answerButton.dispatchEvent("click");
  await expect(page.getByText("Bravo !")).toBeVisible();
}

async function getDisplayedWrongAnswer(page: Page, correctAnswer: number) {
  const answerLabels = await page
    .locator(".answer-button")
    .evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute("aria-label") ?? ""),
    );
  const wrongAnswer = answerLabels
    .map((label) => Number(label.replace("Réponse ", "")))
    .find((answer) => Number.isFinite(answer) && answer !== correctAnswer);

  if (wrongAnswer === undefined) {
    throw new Error("No wrong answer found in current question");
  }

  return wrongAnswer;
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    bodyScrollWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.documentScrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
  expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
}

async function getPersistedRewards(page: Page) {
  return page.evaluate(() => {
    const rawState = localStorage.getItem("edukotable:v1");

    if (!rawState) {
      throw new Error("No EdukoTable state found in localStorage");
    }

    return JSON.parse(rawState).rewards as {
      sessionsCompleted: number;
      stickersUnlocked: string[];
    };
  });
}

function getProductFromOperation(operationText: string): number {
  const [left, right] = operationText.split("×").map((item) => Number(item.trim()));
  return left * right;
}
