import React, { Fragment } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

const PageLayout = ({ dark, children }) => (
  <Fragment>
    <Header dark={dark} />
    {children}
    <Footer />
  </Fragment>
);

export default PageLayout;
