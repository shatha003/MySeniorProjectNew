import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const scrollable = document.querySelector('.overflow-y-auto');
      if (scrollable) {
        (scrollable as HTMLElement).scrollTop = 0;
      }
      const main = document.querySelector('main');
      if (main) {
        (main as HTMLElement).scrollTop = 0;
      }
    }, 10);
  }, [pathname]);

  return null;
}