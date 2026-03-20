"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    try {
        res.json({
            success: true,
            rate: 1380,
        });
    }
    catch (error) {
        console.error("환율 조회 실패:", error);
        res.status(500).json({
            success: false,
            message: "환율 조회 실패",
        });
    }
});
exports.default = router;
