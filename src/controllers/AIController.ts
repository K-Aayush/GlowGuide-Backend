import { Request, Response } from "express";
import { OpenAI } from "openai";
import { db } from "../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AuthRequest extends Request {
  user?: any;
}

export const getProductRecommendations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id;

    // Get user's skin profile
    const skinProfile = await db.skinProfile.findUnique({
      where: { userId },
      include: {
        SkinType: true,
        Concerns: true,
      },
    });

    if (!skinProfile) {
      res.status(404).json({
        success: false,
        message: "Skin profile not found",
      });
      return;
    }

    const skinTypes = skinProfile.SkinType.map((s) => s.type).join(", ");
    const concerns = skinProfile.Concerns.map((c) => c.concern).join(", ");
    const allergies = skinProfile.allergies || "None";

    // Generate AI recommendations
    const prompt = `Based on the following skin profile, recommend skincare products:
    Skin Types: ${skinTypes}
    Concerns: ${concerns}
    Allergies: ${allergies}
    Goals: ${skinProfile.goals}
    
    Please provide specific product recommendations that address these concerns while avoiding any allergens.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a skincare expert providing personalized product recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const recommendations = completion.choices[0].message.content;

    // Get matching products from database
    const products = await db.product.findMany({
      where: {
        suitableSkinTypes: {
          some: {
            type: {
              in: skinProfile.SkinType.map((s) => s.type),
            },
          },
        },
        targetConcerns: {
          some: {
            concern: {
              in: skinProfile.Concerns.map((c) => c.concern),
            },
          },
        },
      },
      take: 5,
    });

    res.json({
      success: true,
      aiRecommendations: recommendations,
      matchingProducts: products,
    });
  } catch (error) {
    console.error("AI recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
