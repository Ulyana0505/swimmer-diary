import Header from "./components/Header.tsx";
import { Outlet } from "react-router-dom";
import { cssBlock } from "./utils.ts";
import { Container, ScrollArea } from "@mantine/core";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <div className={cssBlock}>
          <ScrollArea
            h={"100%"}
            scrollbarSize={8}
            scrollHideDelay={2000}
            scrollbars="y"
            style={{ borderRadius: "1em" }}>
            <Container p={"0.5em"}>
              <Outlet />
            </Container>
          </ScrollArea>
        </div>
      </main>
    </>
  );
}
