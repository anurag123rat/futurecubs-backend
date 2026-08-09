
import "dotenv/config";
import mongoose from "mongoose";
import ActivityTemplate from "../models/ActivityTemplate";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const adminId = "6a4754fe2134f400734e98e7";

  const templates = [
    // ---- Original 3 ----
    {
      title: "Animal Shadow Matching",
      description: "Match each animal to its correct shadow",
      activityType: "drag-drop-match",
      ageGroupMin: 2,
      ageGroupMax: 4,
      config: {
        items: [
          { id: "lion", label: "Lion", emoji: "🦁", matchId: "lion-shadow", role: "source" },
          { id: "lion-shadow", label: "Lion Shadow", emoji: "🦁", matchId: "lion", role: "target" },
          { id: "cat", label: "Cat", emoji: "🐱", matchId: "cat-shadow", role: "source" },
          { id: "cat-shadow", label: "Cat Shadow", emoji: "🐱", matchId: "cat", role: "target" },
        ],
        instructions: "Drag each animal to its matching shadow",
      },
      status: "active",
      createdBy: adminId,
    },
    {
      title: "Shape Sorting",
      description: "Sort shapes into correct bins",
      activityType: "shape-sort",
      ageGroupMin: 4,
      ageGroupMax: 6,
      config: {
        items: [
          { id: "circle1", label: "Circle", emoji: "🔵", matchId: "circle-bin", role: "source" },
          { id: "circle-bin", label: "Circle Bin", emoji: "🔵", matchId: "circle1", role: "target" },
          { id: "square1", label: "Square", emoji: "🟥", matchId: "square-bin", role: "source" },
          { id: "square-bin", label: "Square Bin", emoji: "🟥", matchId: "square1", role: "target" },
        ],
        instructions: "Drag each shape into its matching bin",
      },
      status: "active",
      createdBy: adminId,
    },
    {
      title: "Color Matching Advanced",
      description: "Match objects to their color category",
      activityType: "color-match",
      ageGroupMin: 6,
      ageGroupMax: 8,
      config: {
        items: [
          { id: "apple", label: "Apple", emoji: "🍎", matchId: "red", role: "source" },
          { id: "red", label: "Red", emoji: "🍎", matchId: "apple", role: "target" },
          { id: "banana", label: "Banana", emoji: "🍌", matchId: "yellow", role: "source" },
          { id: "yellow", label: "Yellow", emoji: "🍌", matchId: "banana", role: "target" },
        ],
        instructions: "Match each fruit to its color",
      },
      status: "active",
      createdBy: adminId,
    },

    // ---- New 5 ----
    {
      title: "Fruit Matching",
      description: "Match each fruit to its name",
      activityType: "drag-drop-match",
      ageGroupMin: 2,
      ageGroupMax: 4,
      config: {
        items: [
          { id: "apple2", label: "Apple", emoji: "🍎", matchId: "apple-label", role: "source" },
          { id: "apple-label", label: "Apple", emoji: "🍎", matchId: "apple2", role: "target" },
          { id: "banana2", label: "Banana", emoji: "🍌", matchId: "banana-label", role: "source" },
          { id: "banana-label", label: "Banana", emoji: "🍌", matchId: "banana2", role: "target" },
        ],
        instructions: "Drag each fruit to its matching label",
      },
      status: "active",
      createdBy: adminId,
    },
    {
      title: "Vegetable Sorting",
      description: "Sort vegetables correctly",
      activityType: "drag-drop-match",
      ageGroupMin: 2,
      ageGroupMax: 4,
      config: {
        items: [
          { id: "carrot", label: "Carrot", emoji: "🥕", matchId: "carrot-t", role: "source" },
          { id: "carrot-t", label: "Carrot", emoji: "🥕", matchId: "carrot", role: "target" },
          { id: "potato", label: "Potato", emoji: "🥔", matchId: "potato-t", role: "source" },
          { id: "potato-t", label: "Potato", emoji: "🥔", matchId: "potato", role: "target" },
        ],
        instructions: "Drag each vegetable to its matching spot",
      },
      status: "active",
      createdBy: adminId,
    },
    {
      title: "Number Counting",
      description: "Match numbers to quantities",
      activityType: "drag-drop-match",
      ageGroupMin: 2,
      ageGroupMax: 4,
      config: {
        items: [
          { id: "one", label: "1", emoji: "1️⃣", matchId: "one-t", role: "source" },
          { id: "one-t", label: "One item", emoji: "🔵", matchId: "one", role: "target" },
          { id: "two", label: "2", emoji: "2️⃣", matchId: "two-t", role: "source" },
          { id: "two-t", label: "Two items", emoji: "🔵🔵", matchId: "two", role: "target" },
        ],
        instructions: "Match the number to the correct quantity",
      },
      status: "active",
      createdBy: adminId,
    },
    {
      title: "Alphabet Matching",
      description: "Match uppercase to lowercase letters",
      activityType: "drag-drop-match",
      ageGroupMin: 2,
      ageGroupMax: 4,
      config: {
        items: [
          { id: "A", label: "A", emoji: "🅰️", matchId: "a", role: "source" },
          { id: "a", label: "a", emoji: "🅰️", matchId: "A", role: "target" },
          { id: "B", label: "B", emoji: "🅱️", matchId: "b", role: "source" },
          { id: "b", label: "b", emoji: "🅱️", matchId: "B", role: "target" },
        ],
        instructions: "Match the capital letter to the small letter",
      },
      status: "active",
      createdBy: adminId,
    },
    {
      title: "Body Parts Matching",
      description: "Match body part names to pictures",
      activityType: "drag-drop-match",
      ageGroupMin: 2,
      ageGroupMax: 4,
      config: {
        items: [
          { id: "eye", label: "Eye", emoji: "👁️", matchId: "eye-t", role: "source" },
          { id: "eye-t", label: "Eye", emoji: "👁️", matchId: "eye", role: "target" },
          { id: "hand", label: "Hand", emoji: "✋", matchId: "hand-t", role: "source" },
          { id: "hand-t", label: "Hand", emoji: "✋", matchId: "hand", role: "target" },
        ],
        instructions: "Match the body part name to its picture",
      },
      status: "active",
      createdBy: adminId,
    },
  ];

  for (const template of templates) {
    await ActivityTemplate.updateOne(
      { title: template.title },
      { $set: template },
      { upsert: true }
    );
  }

  console.log(`Seeded/updated ${templates.length} templates successfully`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});