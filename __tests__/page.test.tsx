import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock framer-motion to simplify testing
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("Home Page", () => {
  it("should load without errors", () => {
    expect(true).toBe(true);
  });

  it("should render 'Saúde Mental no Trabalho' text in hero section", () => {
    render(<Home />);
    // Find the element containing "Saúde Mental" in the hero section
    const elements = screen.queryAllByText(/Saúde Mental no Trabalho/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should NOT render logo above 'Saúde Mental no Trabalho' in hero section", () => {
    const { container } = render(<Home />);

    // Find all elements with "Saúde Mental no Trabalho" text
    const saudeMentalElements = screen.queryAllByText(/Saúde Mental no Trabalho/i);
    expect(saudeMentalElements.length).toBeGreaterThan(0);

    // Find all logo images by alt text
    const logoImages = container.querySelectorAll('img[alt="QWork Logo"]');

    // Should have only 2 logos (header + footer), not 3
    // The logo above "Saúde Mental no Trabalho" in hero section has been removed
    expect(logoImages.length).toBe(2);
  });
});
