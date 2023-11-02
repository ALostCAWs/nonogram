/* ---- Imports Section */
import React from 'react';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fillState } from "../nonogram/state.js";
// Components
import { NonogramProvider } from '../nonogram/playGame/nonogramProvider.js';
/* End ---- */

const filled = fillState.filled;
const marked = fillState.marked;
const empty = fillState.empty;
const error = fillState.error;
const complete = 'complete';

const gameSolution5x5 = [[true, true, true, true, true],
[false, true, false, false, false],
[false, true, false, true, false],
[true, true, true, false, false],
[false, false, false, false, false]];

/* FILLMODE */
it('sets the fillMode to true on component initialization', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  const fillButton = screen.getByRole('button', { name: 'Fill' });
  const markButton = screen.getByRole('button', { name: 'Mark' });

  expect(fillButton).toBeDisabled();
  expect(markButton).toBeEnabled();
});

it('toggles the fillMode on click', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  const fillButton = screen.getByRole('button', { name: 'Fill' });
  const markButton = screen.getByRole('button', { name: 'Mark' });

  userEvent.click(markButton);

  expect(fillButton).toBeEnabled();
  expect(markButton).toBeDisabled();
});

/* TILES */
it('initializes the tiles with fillState.empty', () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  // true tile
  const tile_true = screen.getByTestId(`tile${0}-${0}`);
  expect(tile_true).not.toHaveClass(filled);
  expect(tile_true).not.toHaveClass(marked);
  expect(tile_true).not.toHaveClass(error);
  expect(tile_true).not.toHaveClass(complete);

  // false tile
  const tile_false = screen.getByTestId(`tile${1}-${0}`);
  expect(tile_false).not.toHaveClass(filled);
  expect(tile_false).not.toHaveClass(marked);
  expect(tile_false).not.toHaveClass(error);
  expect(tile_false).not.toHaveClass(complete);
});

it('initializes the tiles in false-only lines with fillState.error', () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);

  const tile_false = screen.getByTestId(`tile${4}-${0}`);
  expect(tile_false).toHaveClass(error);
});

it('highlights the associated hints on hover', () => {
  const rowIndex = 0;
  const colIndex = 0;

  render(<NonogramProvider gameSolution={gameSolution5x5} />);

  const tile = screen.getByTestId(`tile${rowIndex}-${colIndex}`);
  const rowHint = screen.getByTestId(`rowHint${rowIndex}`);
  const colHint = screen.getByTestId(`colHint${colIndex}`);

  // mouseenter
  userEvent.hover(tile);
  expect(rowHint).toHaveClass('hoverHint');
  expect(colHint).toHaveClass('hoverHint');

  // mouseleave
  userEvent.unhover(tile);
  expect(rowHint).not.toHaveClass('hoverHint');
  expect(colHint).not.toHaveClass('hoverHint');
});

it('sets tile to correct fillState on click - fillMode true', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  userEvent.click(screen.getByRole('button', { name: 'Fill' }));

  const tile_fill = screen.getByTestId(`tile${0}-${0}`);
  userEvent.click(tile_fill);
  expect(tile_fill).toHaveClass(filled);

  const tile_error = screen.getByTestId(`tile${1}-${0}`);
  userEvent.click(tile_error);
  expect(tile_error).toHaveClass(error);

  const tile_completeFill = screen.getByTestId(`tile${3}-${0}`);
  userEvent.click(tile_completeFill);
  const tile_completeMark = screen.getByTestId(`tile${2}-${0}`);
  expect(tile_completeMark).toHaveClass(complete);
});

it('sets tile to correct fillState on click - fillMode false', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  const markButton = screen.getByRole('button', { name: 'Mark' });
  userEvent.click(markButton);

  const tile_mark = screen.getByTestId(`tile${0}-${0}`);
  userEvent.click(tile_mark);
  expect(tile_mark).toHaveClass(marked);

  userEvent.click(tile_mark);
  expect(tile_mark).not.toHaveClass(marked);
});

/* LIVES */
it('initializes with the at least one life', () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  expect(screen.getAllByTestId('life').length).toBeGreaterThan(0);
});

it('initializes with the correct number of lives based on the board dimensions', () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  expect(screen.getAllByTestId('life').length).toEqual(3);
});

it('reduces the lives count by one when an error is made', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  let lifeCount_preClick = screen.getAllByTestId('life').length;
  const tile_error = screen.getByTestId(`tile${1}-${0}`);

  userEvent.click(tile_error);
  let lifeCount_postClick = screen.getAllByTestId('life').length;

  expect(lifeCount_preClick - lifeCount_postClick).toEqual(1);
});

it('only reduces the lives count when clicking on an error tile for the first time', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  let lifeCount_preClick = screen.getAllByTestId('life').length;
  const tile_error = screen.getByTestId(`tile${1}-${0}`);

  userEvent.click(tile_error);
  userEvent.click(tile_error);
  let lifeCount_postClick = screen.getAllByTestId('life').length;

  expect(lifeCount_preClick - lifeCount_postClick).toEqual(1);
});

it('does not change the lives count when there is no error made', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  let lifeCount_preClick = screen.getAllByTestId('life').length;
  const tile_fill = screen.getByTestId(`tile${0}-${0}`);

  userEvent.click(tile_fill);
  let lifeCount_postClick = screen.getAllByTestId('life').length;
  expect(lifeCount_preClick - lifeCount_postClick).toEqual(0);
});

it('ends the game when lives run out', async () => {
  render(<NonogramProvider gameSolution={gameSolution5x5} />);
  const tile_error_1 = screen.getByTestId(`tile${1}-${0}`);
  const tile_error_2 = screen.getByTestId(`tile${1}-${2}`);
  const tile_error_3 = screen.getByTestId(`tile${1}-${3}`);

  userEvent.click(tile_error_1);
  userEvent.click(tile_error_2);
  userEvent.click(tile_error_3);

  expect(screen.queryByTestId('life')).toBeNull();
  expect(screen.getAllByRole('button', { name: 'Retry' })).not.toBeNull();
});

/* HINTS */
// More complex hint tests go here
// Hints test file to test very simple things

// Tests for here
//