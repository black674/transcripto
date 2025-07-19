import React from "react";
import { lazy, Suspense } from "react";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

// Layout Components
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import Sidebar from "./components/sidebar/Sidebar";
import ScrollToTop from "./components/ScrollToTop";

// Providers
import { AuthProvider } from "./lib/auth/AuthContext";
import { TranscriptProvider } from "./lib/transcriptContext/TranscriptContext";

// Components
import ProtectedRoute from "./lib/ProtectedRoute";
import { LoadingPage } from "./components/shared/LoadingPage";
import { ErrorCard } from "./components/shared/ErrorCard";

// Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ConfirmPage = lazy(() => import("./pages/ConfirmPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const TranscriptPage = lazy(() => import("./pages/TranscriptPage"));
const ExtractTranscriptPage = lazy(() =>
  import("./pages/ExtractTranscriptPage")
);
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ChannelPage = lazy(() => import("./pages/ChannelPage"));
const PlaylistPage = lazy(() => import("./pages/PlaylistPage"));
const MarkdownPage = lazy(() => import("./pages/MarkdownPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const InvalidRoutePage = lazy(() => import("./pages/InvalidRoutePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
          <ErrorCard className="!max-w-2xl" message={this.state.error} />
        </div>
      );
    }
    return this.props.children;
  }
}

const withErrorBoundary = (Component, fallback = <LoadingPage />) => (
  <ErrorBoundary>
    <Suspense fallback={fallback}>{Component}</Suspense>
  </ErrorBoundary>
);

const MainLayout = () => (
  <>
    <Header />
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
    <Footer />
    <ScrollToTop />
  </>
);

const SidebarLayout = ({ children }) => (
  <ProtectedRoute>
    <ScrollToTop />
    <Sidebar />
    <div className="lg:pl-16">
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<LoadingPage />}>{children}</Suspense>
      </ErrorBoundary>
      <Footer />
    </div>
  </ProtectedRoute>
);

const publicRoutes = [
  { path: "/", element: withErrorBoundary(<HomePage />) },
  { path: "/confirm", element: withErrorBoundary(<ConfirmPage />) },
  { path: "/pricing", element: withErrorBoundary(<PricingPage />) },
  { path: "/contact", element: withErrorBoundary(<ContactPage />) },
  { path: "/markdown/:pathname", element: withErrorBoundary(<MarkdownPage />) },
  { path: "/404", element: withErrorBoundary(<NotFoundPage />) },
  { path: "*", element: withErrorBoundary(<InvalidRoutePage />) },
];

const protectedRoutes = [
  {
    path: "/transcript/:videoId?",
    element: (
      <SidebarLayout>
        <TranscriptProvider>
          {withErrorBoundary(<TranscriptPage />)}
        </TranscriptProvider>
      </SidebarLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <SidebarLayout>{withErrorBoundary(<ProfilePage />)}</SidebarLayout>
    ),
  },
  {
    path: "/history",
    element: (
      <SidebarLayout>{withErrorBoundary(<HistoryPage />)}</SidebarLayout>
    ),
  },
  {
    path: "/extract-transcript",
    element: (
      <SidebarLayout>
        {withErrorBoundary(<ExtractTranscriptPage />)}
      </SidebarLayout>
    ),
  },
  {
    path: "/channel",
    element: (
      <SidebarLayout>{withErrorBoundary(<ChannelPage />)}</SidebarLayout>
    ),
  },
  {
    path: "/playlist",
    element: (
      <SidebarLayout>{withErrorBoundary(<PlaylistPage />)}</SidebarLayout>
    ),
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: publicRoutes,
  },
  ...protectedRoutes,
]);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
