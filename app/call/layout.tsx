import React, { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren) => {
  return <div className="h-screen bg-black">{children}</div>
}

export default Layout
