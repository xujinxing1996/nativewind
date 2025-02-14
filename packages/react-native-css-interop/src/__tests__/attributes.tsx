import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import {
  ReactComponent,
  createMockComponent,
  registerCSS,
  resetStyles,
} from "../testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent<
  typeof View &
    ReactComponent<{
      disabled?: boolean;
      dataSet?: Record<string, any>;
    }>
>(View);

beforeEach(() => resetStyles());

test(":disabled", () => {
  registerCSS(`.test:disabled { width: 10px; }`);

  const component = render(<A testID={testID} className="test" />).getByTestId(
    testID,
  );

  expect(component).toHaveStyle(undefined);

  screen.rerender(<A testID={testID} className="test" disabled />);

  expect(component).toHaveStyle({ width: 10 });
});

test(":empty", () => {
  registerCSS(`.test:empty { width: 10px; }`);

  const component = render(
    <A testID={testID} className="test">
      Test
    </A>,
  ).getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  screen.rerender(<A testID={testID} className="test" disabled />);

  expect(component).toHaveStyle({ width: 10 });
});

describe.only("dataSet attribute selector", () => {
  test("truthy", () => {
    registerCSS(`.test[data-test] { width: 10px; }`);

    const component = render(
      <A testID={testID} className="test" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle(undefined);

    screen.rerender(
      <A testID={testID} className="test" dataSet={{ test: true }} />,
    );

    expect(component).toHaveStyle({
      width: 10,
    });
  });

  test.only("equals", () => {
    registerCSS(`.test[data-test='1'] { width: 10px; }`);

    const component = render(
      <A testID={testID} className="test" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle(undefined);

    screen.rerender(
      <A testID={testID} className="test" dataSet={{ test: 2 }} />,
    );

    expect(component).toHaveStyle(undefined);

    screen.rerender(
      <A testID={testID} className="test" dataSet={{ test: 1 }} />,
    );

    expect(component).toHaveStyle({
      width: 10,
    });
  });
});
