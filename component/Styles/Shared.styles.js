import styled, { css } from "styled-components";

import {
  background,
  border,
  boxShadow,
  color,
  compose,
  flexbox,
  layout,
  position,
  space,
  textAlign,
  typography,
} from "styled-system";

export const StyledFlexBox = styled.div`
  box-sizing: border-box;
  cursor: ${({ cursor }) => cursor};
  display: flex;
  position: relative;
  ${compose(
    flexbox,
    position,
    space,
    layout,
    color,
    border,
    boxShadow,
    background,
    typography
  )}
`;
export const StyledBox = styled.div`
  box-sizing: border-box;
  cursor: ${({ cursor }) => cursor};
  position: relative;
  ${compose(
    flexbox,
    position,
    space,
    layout,
    color,
    border,
    boxShadow,
    background,
    typography,
    textAlign
  )}
`;
export const StyledLabel = styled.label`
  box-sizing: border-box;
  position: relative;
  ${compose(
    flexbox,
    position,
    space,
    layout,
    color,
    border,
    boxShadow,
    background,
    typography
  )}
`;

export const textEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledText = styled.div`
  cursor: ${({ cursor }) => cursor};
  ${compose(space, color, typography, position, layout)}
  ${({ ellipsis }) => (ellipsis ? textEllipsis : "")}
`;

export const StyledImage = styled.img`
  cursor: ${({ cursor }) => cursor};
  ${compose(space, position, layout, border, color)}
`;

export const StyledButton = styled.button`
  box-sizing: border-box;
  position: relative;
  ${compose(
    flexbox,
    position,
    space,
    layout,
    color,
    border,
    boxShadow,
    background,
    typography
  )}
`;
