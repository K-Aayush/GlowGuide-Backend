import { Request, Response } from "express";
import { db } from "../lib/prisma";

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await db.user.findMany({
      where: {
        role: "USER",
        skinProfile: {
          isNot: null,
        },
      },
      include: {
        skinProfile: {
          include: {
            SkinType: true,
            Concerns: true,
          },
        },
        progressLogs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    res.json({
      success: true,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPatientDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await db.user.findUnique({
      where: { id },
      include: {
        skinProfile: {
          include: {
            SkinType: true,
            Concerns: true,
          },
        },
        progressLogs: {
          orderBy: { createdAt: "desc" },
        },
        routines: {
          include: {
            steps: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      });
      return;
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getDermatologistStats = async (req: Request, res: Response) => {
  try {
    const [
      totalPatients,
      newPatientsThisMonth,
      pendingAssessments,
      totalRoutines,
    ] = await Promise.all([
      db.user.count({
        where: {
          role: "USER",
          skinProfile: {
            isNot: null,
          },
        },
      }),
      db.user.count({
        where: {
          role: "USER",
          skinProfile: {
            is: {
              createdAt: {
                gte: new Date(new Date().setDate(1)),
              },
            },
          },
        },
      }),
      db.skinProfile.count({
        where: {
          lastAssessment: {
            lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      db.routine.count(),
    ]);

    res.json({
      success: true,
      stats: {
        totalPatients,
        newPatientsThisMonth,
        pendingAssessments,
        totalRoutines,
      },
    });
  } catch (error) {
    console.error("Get dermatologist stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const recentActivity = await Promise.all([
      // Get recent routines
      db.routine.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
        },
      }),
      // Get recent assessments
      db.skinProfile.findMany({
        take: 5,
        orderBy: { lastAssessment: "desc" },
        include: {
          user: true,
        },
      }),
      // Get recent progress logs
      db.progressLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
        },
      }),
    ]);

    const [routines, assessments, progressLogs] = recentActivity;

    // Combine and sort all activities by date
    const allActivities = [
      ...routines.map((r) => ({
        type: "routine_created",
        date: r.createdAt,
        patient: r.user.name,
        details: r.name,
      })),
      ...assessments.map((a) => ({
        type: "assessment_completed",
        date: a.lastAssessment,
        patient: a.user.name,
        details: `Updated skin profile`,
      })),
      ...progressLogs.map((p) => ({
        type: "progress_update",
        date: p.createdAt,
        patient: p.user.name,
        details: `Added progress log`,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    res.status(200).json({
      success: true,
      activities: allActivities.slice(0, 10),
    });
  } catch (error) {
    console.error("Get recent activity error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
