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
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
import { fireEvent, render, wait } from '@testing-library/react';
import { ListActions } from '../ListActions';

describe('<ListActions /> spec', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const defaultProps = {
    onStartDetectors: jest.fn(),
    onStopDetectors: jest.fn(),
    onDeleteDetectors: jest.fn(),
    isActionsDisabled: true,
    isStartDisabled: false,
    isStopDisabled: false,
  };
  describe('List actions', () => {
    console.error = jest.fn();
    test('renders component when disabled', async () => {
      const { container, getByTestId, queryByText } = render(
        <ListActions {...defaultProps} />
      );
      expect(container.firstChild).toMatchSnapshot();
      expect(queryByText('Start')).toBeNull();
      expect(queryByText('Stop')).toBeNull();
      expect(queryByText('Delete')).toBeNull();
      fireEvent.click(getByTestId('listActionsButton'));
      await wait();
      expect(queryByText('Start')).toBeNull();
      expect(queryByText('Stop')).toBeNull();
      expect(queryByText('Delete')).toBeNull();
    });
    test('renders component when enabled', async () => {
      const { container, getByTestId, queryByText } = render(
        <ListActions {...defaultProps} isActionsDisabled={false} />
      );
      expect(container.firstChild).toMatchSnapshot();
      expect(queryByText('Start')).toBeNull();
      expect(queryByText('Stop')).toBeNull();
      expect(queryByText('Delete')).toBeNull();
      fireEvent.click(getByTestId('listActionsButton'));
      await wait();
      expect(queryByText('Start real-time detectors')).not.toBeNull();
      expect(queryByText('Stop real-time detectors')).not.toBeNull();
      expect(queryByText('Delete detectors')).not.toBeNull();
    });
    test('should call onStartDetectors when clicking on start action', async () => {
      const { getByTestId } = render(
        <ListActions {...defaultProps} isActionsDisabled={false} />
      );
      fireEvent.click(getByTestId('listActionsButton'));
      await wait();
      fireEvent.click(getByTestId('startDetectors'));
      expect(defaultProps.onStartDetectors).toHaveBeenCalled();
    });
    test('should call onStopDetectors when clicking on stop action', async () => {
      const { getByTestId } = render(
        <ListActions {...defaultProps} isActionsDisabled={false} />
      );
      fireEvent.click(getByTestId('listActionsButton'));
      await wait();
      fireEvent.click(getByTestId('stopDetectors'));
      expect(defaultProps.onStopDetectors).toHaveBeenCalled();
    });
    test('should call onDeleteDetectors when clicking on delete action', async () => {
      const { getByTestId } = render(
        <ListActions {...defaultProps} isActionsDisabled={false} />
      );
      fireEvent.click(getByTestId('listActionsButton'));
      await wait();
      fireEvent.click(getByTestId('deleteDetectors'));
      expect(defaultProps.onDeleteDetectors).toHaveBeenCalled();
    });
  });
});
