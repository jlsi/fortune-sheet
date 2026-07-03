import { render, waitFor } from "@testing-library/react";
import React from "react";
import Workbook from "../src/components/Workbook";

describe("Worksheet", () => {
  it("should render", async () => {
    const { queryByText, container } = render(
      <Workbook data={[{ name: "Sheet1" }]} />
    );
    expect(container.querySelector(".fortune-sheet-container")).toBeTruthy();
    expect(queryByText("Sheet1")).toBeTruthy();
  });

  it("should hide row and column resize handles in readonly mode", async () => {
    const { container } = render(
      <Workbook data={[{ name: "Sheet1" }]} allowEdit={false} />
    );

    await waitFor(() => {
      expect(container.querySelector(".fortune-cols-change-size")).toBeNull();
      expect(container.querySelector(".fortune-rows-change-size")).toBeNull();
    });
  });
});
