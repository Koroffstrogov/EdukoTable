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
