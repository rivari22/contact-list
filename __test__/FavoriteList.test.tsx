import { render, screen } from "@testing-library/react";
import FavoriteList from "../src/modules/ContactList/FavoriteList";
import "@testing-library/jest-dom";
import { dataMockTable } from "./mocks/dataTable";

describe("Favorite section", () => {
  it("renders a title", () => {
    const mockFunction = jest.fn();
    render(
      <FavoriteList data={dataMockTable} handleOnClickFavorite={mockFunction} />
    );

    const title = screen.getByTestId('title-favorite-list-testid')

    expect(title).toBeInTheDocument();
  });

  it("renders a table favorite list", () => {
    const mockFunction = jest.fn();
    render(
      <FavoriteList data={dataMockTable} handleOnClickFavorite={mockFunction} />
    );

    const element = screen.getByTestId('table-favorite-list-testid')

    expect(element).toBeInTheDocument();
  });
});
