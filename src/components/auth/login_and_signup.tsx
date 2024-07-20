"use client";

import {
  useUser,
  useRedirectFunctions,
  useLogoutFunction,
} from "@propelauth/nextjs/client";

const LoginAndSignup = () => {
  // If the user is not logged in, they will be redirected to the login page
  const { loading, user } = useUser();
  const { redirectToSignupPage, redirectToLoginPage } = useRedirectFunctions();
  const logoutFn = useLogoutFunction();
  if (loading)
    return (
      <div className="container mx-auto flex items-center justify-center h-screen w-1/3">
        <div className="container mx-auto flex flex-col gap-4 text-center justify-centerbg-white shadow-sm ">
          <div>Loading...</div>
        </div>
      </div>
    );
  if (user) {
    return (
      <div>
        <p>You are logged in as {user.email}</p>
        <p>{user.emailConfirmed}</p>
        <button onClick={() => redirectToLoginPage()}>Account</button>
        <button onClick={logoutFn}>Logout</button>
      </div>
    );
  } else {
    // if (!user) {
    return (
      <div className="container mx-auto flex items-center justify-center h-screen w-1/3">
        <div className="container mx-auto flex flex-col gap-4 text-center justify-centerbg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
          <p>Kaylie - KANBAN</p>
          <div className="flex flex-col justify-between mx-auto w-full gap-2">
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => redirectToLoginPage()}>
              Login
            </button>
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => redirectToSignupPage()}>
              Signup
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginAndSignup;