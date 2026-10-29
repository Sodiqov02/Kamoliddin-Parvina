// GitHub project sites are served under /<repository>; user sites use /.
export function pagesBase(env = process.env) {
  const [owner = '', repository = ''] = (env.GITHUB_REPOSITORY ?? '').split('/');
  const defaultBase = repository && repository !== `${owner}.github.io` ? `/${repository}` : '';
  return (env.PAGES_BASE_PATH ?? defaultBase).replace(/\/$/, '');
}
