import { expect, test, type Page } from "@playwright/test";
import { createInitialFairyCollection, FAIRY_CARDS } from "../../src/domain/fairyCards";
import type { AppState } from "../../src/domain/types";

test("chooses a companion, earns a card despite mistakes, and keeps it after reloading", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Découvrir les Fabuleuses" }).click();
  await page.getByRole("button", { name: "Coralie Glouglou", exact: true }).click();
  await page.getByRole("button", { name: "Choisir Coralie Glouglou" }).click();
  await expect(page.getByRole("button", { name: "Coralie Glouglou t’accompagne" })).toBeDisabled();
  await page.getByRole("button", { name: "Accueil", exact: true }).click();
  await completeMission(page, false);
  await expect(page.getByText("Nouvelle Fabuleuse", { exact: true })).toBeVisible();
  await expect(page.locator(".fairy-reveal strong")).toHaveText("Coralie Glouglou · Bulle-Bisou");
  await page.getByRole("button", { name: "Voir ma Fabuleuse dans l’album" }).click();
  await expect(page.getByText("1 / 60 cartes gagnées")).toBeVisible();
  const rewards = (await persistedState(page)).rewards;
  expect(rewards.fairyCollection.unlockedCardIds).toEqual(["coralie-1"]);
  expect(rewards.fairyCollection.sessionsByFamily).toEqual({ ...createInitialFairyCollection().sessionsByFamily, coralie: 1 });
  expect(rewards.stickersUnlocked.length).toBeGreaterThan(0);
  await page.reload();
  await page.getByRole("button", { name: "Album", exact: true }).click();
  await expect(page.getByRole("button", { name: "Coralie Glouglou t’accompagne" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Voir Coralie Glouglou : Bulle-Bisou, carte gagnée" })).toBeVisible();
});

test("previews the selected cat artwork on compact mobile with keyboard and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Album", exact: true }).click();
  const cardButton = page.getByRole("button", { name: "Voir Ronronova : Impératrice des étoiles, aperçu à débloquer" });
  await cardButton.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Fermer", exact: true })).toBeFocused();
  await expect(dialog.getByText("Aperçu de la carte", { exact: true })).toBeVisible();
  const artwork = dialog.locator(".fairy-art");
  await expect(artwork).toHaveAttribute("src", "/cards/fabuleuses/ronronova-4.webp");
  await expect(artwork).toHaveCSS("animation-name", "none");
  expect(await artwork.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(768);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  const box = await dialog.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(320);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(cardButton).toBeFocused();
  await page.getByText("Les 8 raretés, du petit éclat au grand WOUAH", { exact: true }).click();
  await expect(page.locator(".fairy-rarity-guide li")).toHaveCount(8);
  expect((await persistedState(page)).rewards.fairyCollection.unlockedCardIds).toEqual([]);
});

test("reaches the final evolution and serves all sixty real card images", async ({ page, request }) => {
  for (const card of FAIRY_CARDS) {
    const response = await request.get(card.artwork);
    expect(response.ok(), card.artwork).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
    expect((await response.body()).length).toBeGreaterThan(20_000);
  }
  await page.goto("/");
  const state = await persistedState(page);
  state.rewards.fairyCollection.sessionsByFamily.ronronova = 6;
  state.rewards.fairyCollection.unlockedCardIds = ["ronronova-1", "ronronova-2", "ronronova-3"];
  await page.evaluate((value) => localStorage.setItem("edukotable:v1", JSON.stringify(value)), state);
  await page.reload();
  await completeMission(page, true);
  await expect(page.getByText("Ton compagnon évolue !", { exact: true })).toBeVisible();
  await expect(page.locator(".fairy-reveal strong")).toHaveText("Ronronova · Impératrice des étoiles");
  const collection = (await persistedState(page)).rewards.fairyCollection;
  expect(collection.unlockedCardIds).toHaveLength(4);
  expect(collection.sessionsByFamily.ronronova).toBe(7);
});

test("browses and selects the second-lot families on compact mobile without losing old cards", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const state = await persistedState(page);
  // A saved album from the first twelve-card release has no counters for new families.
  await page.evaluate((value) => localStorage.setItem("edukotable:v1", JSON.stringify({
    ...value,
    rewards: { ...value.rewards, fairyCollection: {
      selectedFamilyId: "ronronova",
      sessionsByFamily: { ronronova: 1, lunabelle: 0, pralinette: 0 },
      unlockedCardIds: ["ronronova-1"],
    } },
  })), state);
  await page.reload();
  await page.getByRole("button", { name: "Album", exact: true }).click();
  await expect(page.getByRole("group", { name: "Familles de Fabuleuses" }).getByRole("button")).toHaveCount(15);
  await expect.poll(() => page.locator(".fairy-family-picker img").evaluateAll((images) =>
    images.every((image) => (image as HTMLImageElement).naturalWidth === 120),
  )).toBe(true);
  expect(await page.locator(".fairy-family-picker button").evaluateAll((buttons) =>
    buttons.every((button) => button.scrollWidth <= button.clientWidth),
  )).toBe(true);
  for (const family of [
    { id: "petalipop", name: "Pétalipop", title: "Impératrice du printemps" },
    { id: "pomponnette", name: "Pomponnette", title: "Gardienne des rêves" },
    { id: "coralie", name: "Coralie Glouglou", title: "Reine des abysses" },
  ]) {
    await page.getByRole("button", { name: family.name, exact: true }).click();
    await expect(page.locator(".fairy-card-button")).toHaveCount(4);
    await page.getByRole("button", { name: `Choisir ${family.name}`, exact: true }).click();
    await page.getByRole("button", { name: `Voir ${family.name} : ${family.title}, aperçu à débloquer`, exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator("img")).toHaveAttribute("src", `/cards/fabuleuses/${family.id}-4.webp`);
    await expect.poll(() => dialog.locator("img").evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(768);
    expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "Fermer", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await page.reload();
  const saved = (await persistedState(page)).rewards.fairyCollection;
  expect(saved.selectedFamilyId).toBe("coralie");
  expect(saved.unlockedCardIds).toEqual(["ronronova-1"]);
  expect(saved.sessionsByFamily).toEqual({ ...createInitialFairyCollection().sessionsByFamily, ronronova: 1 });
});

test("adds musician, ninja and basketball companions to a saved six-family album and earns a new card", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const state = await persistedState(page);
  await page.evaluate((value) => localStorage.setItem("edukotable:v1", JSON.stringify({
    ...value,
    rewards: { ...value.rewards, fairyCollection: {
      selectedFamilyId: "coralie",
      sessionsByFamily: { ronronova: 0, lunabelle: 0, pralinette: 0, petalipop: 0, pomponnette: 0, coralie: 1 },
      unlockedCardIds: ["coralie-1"],
    } },
  })), state);
  await page.reload();
  await page.getByRole("button", { name: "Album", exact: true }).click();
  for (const family of [
    { id: "flutinelle", name: "Flûtinelle", title: "Symphonie des aurores" },
    { id: "ninachou", name: "Ninachou", title: "Éclipse de paillettes" },
    { id: "basketoile", name: "Baskétoile", title: "Reine du panier cosmique" },
  ]) {
    const button = page.getByRole("button", { name: family.name, exact: true });
    await button.click();
    expect(await button.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: `Choisir ${family.name}`, exact: true }).click();
    const card = page.getByRole("button", { name: `Voir ${family.name} : ${family.title}, aperçu à débloquer`, exact: true });
    await card.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator("img")).toHaveAttribute("src", `/cards/fabuleuses/${family.id}-4.webp`);
    await expect.poll(() => dialog.locator("img").evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(768);
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "Fermer", exact: true }).click();
    await expect(card).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await page.reload();
  const saved = (await persistedState(page)).rewards.fairyCollection;
  expect(saved.selectedFamilyId).toBe("basketoile");
  expect(saved.unlockedCardIds).toEqual(["coralie-1"]);
  expect(saved.sessionsByFamily).toEqual({ ...createInitialFairyCollection().sessionsByFamily, coralie: 1 });
  await completeMission(page, false);
  await expect(page.locator(".fairy-reveal strong")).toHaveText("Baskétoile · Mini-Rebond");
  expect((await persistedState(page)).rewards.fairyCollection.unlockedCardIds).toEqual(["coralie-1", "basketoile-1"]);
});

test("adds plant, otter and shampoo families to a saved nine-family album and earns a card", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const state = await persistedState(page);
  await page.evaluate((value) => localStorage.setItem("edukotable:v1", JSON.stringify({
    ...value,
    rewards: { ...value.rewards, fairyCollection: {
      selectedFamilyId: "ninachou",
      sessionsByFamily: { ronronova: 0, lunabelle: 0, pralinette: 0, petalipop: 0, pomponnette: 0, coralie: 0, flutinelle: 0, ninachou: 1, basketoile: 0 },
      unlockedCardIds: ["ninachou-1"],
    } },
  })), state);
  await page.reload();
  await page.getByRole("button", { name: "Album", exact: true }).click();
  for (const family of [
    { id: "poussinelle", name: "Poussinelle", title: "Floraison cosmique" },
    { id: "loutrelune", name: "Loutrelune", title: "Oracle des marées" },
    { id: "shampouff", name: "Shampouff", title: "Génie des bulles" },
  ]) {
    const button = page.getByRole("button", { name: family.name, exact: true });
    await button.click();
    expect(await button.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: `Choisir ${family.name}`, exact: true }).click();
    const card = page.getByRole("button", { name: `Voir ${family.name} : ${family.title}, aperçu à débloquer`, exact: true });
    await card.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator("img")).toHaveAttribute("src", `/cards/fabuleuses/${family.id}-4.webp`);
    await expect.poll(() => dialog.locator("img").evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(768);
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "Fermer", exact: true }).click();
    await expect(card).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await page.reload();
  const saved = (await persistedState(page)).rewards.fairyCollection;
  expect(saved.selectedFamilyId).toBe("shampouff");
  expect(saved.unlockedCardIds).toEqual(["ninachou-1"]);
  expect(saved.sessionsByFamily).toEqual({ ...createInitialFairyCollection().sessionsByFamily, ninachou: 1 });
  await completeMission(page, false);
  await expect(page.locator(".fairy-reveal strong")).toHaveText("Shampouff · Bulle-Malice");
  await page.getByRole("button", { name: "Voir ma Fabuleuse dans l’album" }).click();
  await expect(page.getByText("2 / 60 cartes gagnées")).toBeVisible();
  await page.reload();
  expect((await persistedState(page)).rewards.fairyCollection.unlockedCardIds).toEqual(["ninachou-1", "shampouff-1"]);
});

test("adds highlighter, demonic backpack and uranium atom to a saved twelve-family album", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const state = await persistedState(page);
  await page.evaluate((value) => localStorage.setItem("edukotable:v1", JSON.stringify({
    ...value,
    rewards: { ...value.rewards, fairyCollection: {
      selectedFamilyId: "shampouff",
      sessionsByFamily: { ronronova: 0, lunabelle: 0, pralinette: 0, petalipop: 0, pomponnette: 0, coralie: 0, flutinelle: 0, ninachou: 0, basketoile: 0, poussinelle: 0, loutrelune: 0, shampouff: 1 },
      unlockedCardIds: ["shampouff-1"],
    } },
  })), state);
  await page.reload();
  await page.getByRole("button", { name: "Album", exact: true }).click();
  for (const family of [
    { id: "fluoribelle", name: "Fluoribelle", title: "Aurore fluo" },
    { id: "sacapouic", name: "Sacapouic", title: "Seigneur du bazar" },
    { id: "uranounet", name: "Uranounet 235", title: "Majesté atomique" },
  ]) {
    const button = page.getByRole("button", { name: family.name, exact: true });
    await button.click();
    expect(await button.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: `Choisir ${family.name}`, exact: true }).click();
    const card = page.getByRole("button", { name: `Voir ${family.name} : ${family.title}, aperçu à débloquer`, exact: true });
    await card.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator("img")).toHaveAttribute("src", `/cards/fabuleuses/${family.id}-4.webp`);
    await expect.poll(() => dialog.locator("img").evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBe(768);
    expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "Fermer", exact: true }).click();
    await expect(card).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  await page.reload();
  const saved = (await persistedState(page)).rewards.fairyCollection;
  expect(saved.selectedFamilyId).toBe("uranounet");
  expect(saved.unlockedCardIds).toEqual(["shampouff-1"]);
  expect(saved.sessionsByFamily).toEqual({ ...createInitialFairyCollection().sessionsByFamily, shampouff: 1 });
  await completeMission(page, false);
  await expect(page.locator(".fairy-reveal strong")).toHaveText("Uranounet 235 · Noyau-Chou");
  await page.getByRole("button", { name: "Voir ma Fabuleuse dans l’album" }).click();
  await expect(page.getByText("2 / 60 cartes gagnées")).toBeVisible();
  await page.reload();
  expect((await persistedState(page)).rewards.fairyCollection.unlockedCardIds).toEqual(["shampouff-1", "uranounet-1"]);
});

async function persistedState(page: Page): Promise<AppState> {
  await expect.poll(() => page.evaluate(() => localStorage.getItem("edukotable:v1"))).not.toBeNull();
  return page.evaluate(() => JSON.parse(localStorage.getItem("edukotable:v1")!));
}

async function completeMission(page: Page, correct: boolean) {
  await page.getByRole("button", { name: "Mission rapide", exact: true }).click();
  await page.getByRole("button", { name: "Commencer", exact: true }).click();
  for (let index = 1; index <= 10; index += 1) {
    await expect(page.getByText(`Question ${index} / 10`, { exact: true })).toBeVisible();
    const factors = (await page.locator(".operation").innerText()).split("×").map(Number);
    const answer = factors[0] * factors[1];
    const button = correct
      ? page.getByRole("button", { name: `Réponse ${answer}`, exact: true })
      : page.locator(".answer-button").filter({ hasNotText: new RegExp(`^${answer}$`) }).first();
    await expect(button).toBeEnabled();
    await button.dispatchEvent("click");
    await expect(page.getByText(correct ? "Bravo !" : "Presque !", { exact: true })).toBeVisible();
  }
  await expect(page.getByText("Mission terminée", { exact: true })).toBeVisible();
}
