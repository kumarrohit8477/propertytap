import {
  useNavigate,
  useLocation,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    pathname: location.pathname,
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useParams() {
  return useRouterParams();
}

export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

export function notFound() {
  if (typeof window !== 'undefined') {
    window.location.href = '/404';
  }
}

export function redirect(url: string) {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}
