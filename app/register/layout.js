export default function Layout({ params, children }) {
    return (
        <body className="body">
            <div className="center-aligned-flex column centered">
                {children}
            </div>
        </body>
    )
  }      