import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    res.json({
      success: true,
      rate: 1380,
    });
  } catch (error) {
    console.error("환율 조회 실패:", error);

    res.status(500).json({
      success: false,
      message: "환율 조회 실패",
    });
  }
});

export default router;
