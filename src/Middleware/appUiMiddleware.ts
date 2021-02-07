import { stringReplace } from 'string-replace-middleware';

type AppUiMiddleware = (env: any) => any;

const macroUiMiddleware: AppUiMiddleware = (env) =>
  stringReplace({
    '%BASE_URL%': env.BASE_URL,
    '%ASSETS_URL%': env.ASSETS_URL,
    '%APP_UI_ENV%': JSON.stringify({}),
  });

export default macroUiMiddleware;
