import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { dark } from "constants/colors";
import { heightHeader } from "components/Header";

const DivMainContainer = styled.div`
  min-height: calc(100vh - ${heightHeader}px);
  background-color: ${dark.background.default};
  display: flex;
`;

const MainContainer = ({ children }) => {
  return <DivMainContainer id='mainContainer'>{children}</DivMainContainer>;
};

MainContainer.propTypes = {
  children: PropTypes.node,
};

export default MainContainer;
