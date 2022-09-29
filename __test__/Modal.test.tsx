import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Modal } from "../src/components/Modal";

describe("Modal component render normally", () => {
  it("renders a title", () => {
    const mockFunction = jest.fn();
    render(
      <Modal isOpen={true} onClickSubmit={mockFunction} onClose={mockFunction}>
        content modal
      </Modal>
    );

    const title = screen.getByText("Title modal");

    expect(title).toBeInTheDocument();
  });

  it("renders a button", () => {
    const mockFunction = jest.fn();
    render(
      <Modal isOpen={true} onClickSubmit={mockFunction} onClose={mockFunction}>
        content modal
      </Modal>
    );

    const btnCancel = screen.getByText("Save");
    const btnSave = screen.getByText("Cancel");
    const content = screen.getByText("content modal");

    expect(content).toBeInTheDocument();
    expect(btnSave).toBeInTheDocument();
    expect(btnCancel).toBeInTheDocument();
  });
});

describe("Modal component function correctly work", () => {
  it("event trigger when click save button", () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();
    render(
      <Modal isOpen={true} onClickSubmit={mockOnSubmit} onClose={mockOnClose}>
        content modal
      </Modal>
    );

    const btnSave = screen.getByText("Save");

    expect(btnSave).toBeInTheDocument();
    fireEvent.click(btnSave)
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("event trigger when click cancel button", () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();
    render(
      <Modal isOpen={true} onClickSubmit={mockOnSubmit} onClose={mockOnClose}>
        content modal
      </Modal>
    );

    const btnCancel = screen.getByText("Cancel");

    expect(btnCancel).toBeInTheDocument();
    fireEvent.click(btnCancel)
    expect(mockOnClose).toHaveBeenCalled();
  });
});
