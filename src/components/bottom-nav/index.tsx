import { Link } from "@tanstack/react-router";

const navLinkBase = "flex-1 flex flex-col items-center justify-center gap-1";

export function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background border-t border-divider flex">
            <Link
                to="/"
                activeOptions={{ exact: true }}
                className={`${navLinkBase} text-default-400`}
                activeProps={{ className: `${navLinkBase} text-primary` }}
            >
                <i className="fa fa-layer-group text-lg" />
                <span className="text-xs">Cards</span>
            </Link>
            <Link
                to="/library"
                className={`${navLinkBase} text-default-400`}
                activeProps={{ className: `${navLinkBase} text-primary` }}
            >
                <i className="fa fa-book text-lg" />
                <span className="text-xs">Library</span>
            </Link>
            <Link
                to="/profile"
                className={`${navLinkBase} text-default-400`}
                activeProps={{ className: `${navLinkBase} text-primary` }}
            >
                <div className="w-7 h-7 rounded-full border-2 border-current grid place-content-center">
                    <i className="fa fa-user text-xs" />
                </div>
                <span className="text-xs">Profile</span>
            </Link>
        </nav>
    );
}
