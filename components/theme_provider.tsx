"use client";

import { MantineProvider } from "@mantine/core";
import React, { FC, PropsWithChildren } from "react";

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
      }}
    >
      {children}
    </MantineProvider>
  );
};

export default ThemeProvider;
