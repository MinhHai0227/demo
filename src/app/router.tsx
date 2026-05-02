import DashboardPage from "@/features/dashboard/dashboard-page"
import HomePage from "@/features/home/home-page"
import HotQuestionsPage from "@/features/hot-questions/hot-questions-page"
import LeadPage from "@/features/lead/lead-page"
import KnowledgeChunkPage from "@/features/knowledge-chunk/knowledge-chunk-page"
import MajorPage from "@/features/major/major-page"
import StaffPage from "@/features/staff/staff-page"
import TuitionPolicyPage from "@/features/tuition-policy/tuition-policy-page"
import QuickProcessingPage from "@/features/quick-processing/quick-processing-page"
import WebCrawlerPage from "@/features/web-crawler/web-crawler-page"
import AdminLayout from "@/layouts/admin-layout"
import HomeLayout from "@/layouts/home-layout"
import LoginLayout from "@/layouts/login-layout"
import { createBrowserRouter } from "react-router-dom"
import MessageLayout from "@/layouts/message-layout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginLayout />,
  },
  {
    path: "/message",
    element: <MessageLayout />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "staffs",
        element: <StaffPage />,
      },
      {
        path: "leads",
        element: <LeadPage />,
      },
      {
        path: "hot-questions",
        element: <HotQuestionsPage />,
      },
      {
        path: "knowledge-chunks",
        element: <KnowledgeChunkPage />,
      },
      {
        path: "majors",
        element: <MajorPage />,
      },
      {
        path: "tuition-policies",
        element: <TuitionPolicyPage />,
      },
      {
        path: "quick-processing",
        element: <QuickProcessingPage />,
      },
      {
        path: "web-crawler",
        element: <WebCrawlerPage />,
      },
    ],
  },
])

export default router
