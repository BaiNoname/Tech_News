<?php

// GET /dashboard/stats - thống kê tổng quan (admin)
if ($uri == "dashboard/stats") {
    checkAdmin();

    jsonResponse(true, "Success", $dashboardModel->stats());
}