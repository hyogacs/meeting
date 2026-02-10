import { auth, signIn, signOut } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-gray-200 bg-white px-6">
      {session?.user ? (
        <div className="flex items-center gap-3">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || ""}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium text-gray-700">
            {session.user.name}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100"
            >
              退出
            </button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            GitHub 登录
          </button>
        </form>
      )}
    </header>
  );
}
