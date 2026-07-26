import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/produits/:path*",
    "/admin/categories/:path*",
    "/admin/commandes/:path*",
    "/admin/parametres/:path*",
    "/admin/utilisateurs/:path*",
  ],
};
