/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NameAndDescription from '../NameAndDescription';

import { Formik } from 'formik';

describe('<NameAndDescription /> spec', () => {
  test('renders the component', () => {
    const { container } = render(
      <Formik initialValues={{ detectorName: '' }} onSubmit={jest.fn()}>
        {() => (
          <div>
            <NameAndDescription onValidateDetectorName={jest.fn()} />
          </div>
        )}
      </Formik>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  test('shows error for detector name input when toggling focus/blur', async () => {
    const handleValidateName = jest.fn().mockImplementation(() => {
      throw 'Required';
    });
    const { queryByText, findByText, getByPlaceholderText } = render(
      <Formik initialValues={{ name: '' }} onSubmit={jest.fn()}>
        {() => (
          <div>
            <NameAndDescription onValidateDetectorName={handleValidateName} />
          </div>
        )}
      </Formik>
    );
    expect(queryByText('Required')).toBeNull();
    fireEvent.focus(getByPlaceholderText('Enter detector name'));

    fireEvent.blur(getByPlaceholderText('Enter detector name'));
    expect(handleValidateName).toHaveBeenCalledWith('');
    expect(handleValidateName).toHaveBeenCalledTimes(1);
    expect(findByText('Required')).not.toBeNull();
  });
  test('shows error for detector description input when toggling focus/bur', async () => {
    const { queryByText, findByText, getByPlaceholderText } = render(
      <Formik
        initialValues={{ name: '', description: '' }}
        onSubmit={jest.fn()}
      >
        {() => (
          <div>
            <NameAndDescription onValidateDetectorName={jest.fn()} />
          </div>
        )}
      </Formik>
    );
    expect(queryByText('Required')).toBeNull();
    fireEvent.focus(getByPlaceholderText('Describe the detector'));
    fireEvent.blur(getByPlaceholderText('Describe the detector'));
    expect(findByText('Required')).not.toBeNull();
  });
});
