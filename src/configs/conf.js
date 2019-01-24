export const drawerWidth = 240;
export const baseUrl = process.env.REACT_APP_BASE_URL;

if (!process.env.REACT_APP_BASE_URL) {
  throw new Error('Please set REACT_APP_BASE_URL before running the application.')
}