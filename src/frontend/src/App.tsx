import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/usePrayers';
import MobileShell from './components/MobileShell';
import ProfileSetupModal from './components/ProfileSetupModal';
import Home from './pages/Home';
import SubmitPrayer from './pages/SubmitPrayer';
import PrayerHistory from './pages/PrayerHistory';
import PrayerDetail from './pages/PrayerDetail';

function Layout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <MobileShell>
        <Outlet />
      </MobileShell>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: SubmitPrayer,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: PrayerHistory,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prayer/$prayerId',
  component: PrayerDetail,
});

const routeTree = rootRoute.addChildren([indexRoute, submitRoute, historyRoute, detailRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
