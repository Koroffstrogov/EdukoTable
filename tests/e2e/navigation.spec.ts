import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("home is visible", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mission rapide" })).toBeVisible();
});

test("opens album and returns home", async ({ page }) => {
  await page.getByRole("button", { name: "Album" }).click();
  await expect(page.getByRole("heading", { name: "Mes stickers" })).toBeVisible();

  await page.getByRole("button", { name: "Accueil" }).click();
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
});

test("opens progression and returns home", async ({ page }) => {
  await page.getByRole("button", { name: "Progression" }).click();
  await expect(page.getByRole("heading", { name: "Progression" })).toBeVisible();
  await expect(page.getByText("Table 2")).toBeVisible();

  await page.getByRole("button", { name: "Accueil" }).click();
  await expect(page.getByRole("heading", { name: "EdukoTable" })).toBeVisible();
});

test("updates settings and returns home", async ({ page }) => {
  await page.getByRole("button", { name: "Réglages" }).click();
  await expect(page.getByRole("heading", { name: "Réglages" })).toBeVisible();

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
});

test("starts a quick mission and shows the first question", async ({ page }) => {
  await page.getByRole("button", { name: "Mission rapide" }).click();
  await expect(page.getByRole("heading", { name: "Je révise quelles tables ?" })).toBeVisible();

  await page.getByRole("button", { name: "Commencer" }).click();
  await expect(page.getByText("Question 1 / 10")).toBeVisible();
  await expect(page.getByText("Combien font ?")).toBeVisible();
});

test("can cancel then abandon a mission without answers", async ({ page }) => {
  await startQuickMission(page);

  await page.getByRole("button", { name: "Quitter" }).click();
  await expect(page.getByRole("dialog", { name: "Arrêter la mission ?" })).toBeVisible();

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
});

async function startQuickMission(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Mission rapide" }).click();
  await page.getByRole("button", { name: "Commencer" }).click();
  await expect(page.getByText("Question 1 / 10")).toBeVisible();
}

function getProductFromOperation(operationText: string): number {
  const [left, right] = operationText.split("×").map((item) => Number(item.trim()));
  return left * right;
}
