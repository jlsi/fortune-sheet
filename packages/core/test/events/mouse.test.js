import { contextFactory, selectionFactory } from "../factories/context";
import {
  handleRowHeaderMouseDown,
  handleColumnHeaderMouseDown,
  handleCellAreaMouseDown,
  handleCellAreaDoubleClick,
  handleColSizeHandleMouseDown,
  handleRowSizeHandleMouseDown,
} from "../../src/events/mouse";

describe("mouse", () => {
  const getContext = () =>
    contextFactory({
      luckysheet_select_save: selectionFactory([0, 0], [0, 0], 0, 0),
    });
  const cache = { editingCommentBoxEle: { dataset: { r: 0, c: 0 } } };
  const container = document.createElement("div");
  const cellInput = document.createElement("div");
  const fxInput = document.createElement("div");
  const rect = {
    width: 1000,
    height: 400,
    left: 0,
    top: 0,
  };

  function setupResizeElements() {
    const headerContainer = document.createElement("div");
    const workbookContainer = document.createElement("div");
    const cellArea = document.createElement("div");
    const changeSizeLine = document.createElement("div");

    headerContainer.getBoundingClientRect = () => rect;
    cellArea.getBoundingClientRect = () => rect;
    changeSizeLine.className = "fortune-change-size-line";
    workbookContainer.appendChild(changeSizeLine);

    return { headerContainer, workbookContainer, cellArea };
  }

  test("row header mouse down", async () => {
    const ctx = getContext();
    const mouseEvent = new MouseEvent("click", { button: 0 });
    mouseEvent.pageY = 99;
    handleRowHeaderMouseDown(
      ctx,
      cache,
      mouseEvent,
      container,
      cellInput,
      fxInput
    );
    expect(ctx.luckysheet_select_save[0].row_focus).toBe(4);
  });

  test("column header mouse down", async () => {
    const ctx = getContext();
    const mouseEvent = new MouseEvent("click", { button: 0 });
    mouseEvent.pageX = 369;
    handleColumnHeaderMouseDown(
      ctx,
      cache,
      mouseEvent,
      container,
      cellInput,
      fxInput
    );
    expect(ctx.luckysheet_select_save[0].column_focus).toBe(4);
  });

  test("cell mouse down", async () => {
    const ctx = getContext();
    const mouseEvent = new MouseEvent("click", { button: 0 });
    container.getBoundingClientRect = () => rect;
    mouseEvent.pageX = 369;
    mouseEvent.pageY = 79;
    handleCellAreaMouseDown(
      ctx,
      cache,
      mouseEvent,
      cellInput,
      container,
      fxInput
    );
    expect(ctx.luckysheet_select_save[0].row_focus).toBe(3);
    expect(ctx.luckysheet_select_save[0].column_focus).toBe(4);
  });

  test("cell double click", async () => {
    const settings = { allowEdit: true };
    const ctx = getContext();
    const mouseEvent = new MouseEvent("dblclick", { button: 0 });
    mouseEvent.pageX = 369;
    mouseEvent.pageY = 79;
    ctx.luckysheet_select_save = selectionFactory([0, 4], [0, 4], 3, 4);
    handleCellAreaDoubleClick(ctx, cache, settings, mouseEvent, container);
    expect(ctx.luckysheetCellUpdate).toEqual([3, 4]);
  });

  test("column resize starts when editable", async () => {
    const ctx = getContext();
    const { headerContainer, workbookContainer, cellArea } =
      setupResizeElements();
    const mouseEvent = new MouseEvent("mousedown", { button: 0 });
    mouseEvent.pageX = 100;

    handleColSizeHandleMouseDown(
      ctx,
      cache,
      mouseEvent,
      headerContainer,
      workbookContainer,
      cellArea
    );

    expect(ctx.luckysheet_cols_change_size).toBe(true);
    expect(ctx.luckysheet_cols_change_size_start).toEqual([100, 1]);
  });

  test("column resize does not start in readonly mode", async () => {
    const ctx = getContext();
    ctx.allowEdit = false;
    ctx.luckysheet_cols_change_size = false;
    ctx.luckysheet_cols_change_size_start = [];
    const { headerContainer, workbookContainer, cellArea } =
      setupResizeElements();
    const mouseEvent = new MouseEvent("mousedown", { button: 0 });
    mouseEvent.pageX = 100;

    handleColSizeHandleMouseDown(
      ctx,
      cache,
      mouseEvent,
      headerContainer,
      workbookContainer,
      cellArea
    );

    expect(ctx.luckysheet_cols_change_size).toBe(false);
    expect(ctx.luckysheet_cols_change_size_start).toEqual([]);
  });

  test("row resize starts when editable", async () => {
    const ctx = getContext();
    const { headerContainer, workbookContainer, cellArea } =
      setupResizeElements();
    const mouseEvent = new MouseEvent("mousedown", { button: 0 });
    mouseEvent.pageY = 45;

    handleRowSizeHandleMouseDown(
      ctx,
      cache,
      mouseEvent,
      headerContainer,
      workbookContainer,
      cellArea
    );

    expect(ctx.luckysheet_rows_change_size).toBe(true);
    expect(ctx.luckysheet_rows_change_size_start).toEqual([45, 2]);
  });

  test("row resize does not start in readonly mode", async () => {
    const ctx = getContext();
    ctx.allowEdit = false;
    ctx.luckysheet_rows_change_size = false;
    ctx.luckysheet_rows_change_size_start = [];
    const { headerContainer, workbookContainer, cellArea } =
      setupResizeElements();
    const mouseEvent = new MouseEvent("mousedown", { button: 0 });
    mouseEvent.pageY = 45;

    handleRowSizeHandleMouseDown(
      ctx,
      cache,
      mouseEvent,
      headerContainer,
      workbookContainer,
      cellArea
    );

    expect(ctx.luckysheet_rows_change_size).toBe(false);
    expect(ctx.luckysheet_rows_change_size_start).toEqual([]);
  });
});
