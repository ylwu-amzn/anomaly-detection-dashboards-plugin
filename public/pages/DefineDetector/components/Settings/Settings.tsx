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

import ContentPanel from '../../../../components/ContentPanel/ContentPanel';
import {
  EuiFieldNumber,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from '@elastic/eui';
import { Field, FieldProps } from 'formik';
import React from 'react';
import {
  isInvalid,
  getError,
  validatePositiveInteger,
  validateNonNegativeInteger,
} from '../../../../utils/utils';
import { BASE_DOCS_LINK } from '../../../../utils/constants';
import { FormattedFormRow } from '../../../../components/FormattedFormRow/FormattedFormRow';

export const Settings = () => {
  return (
    <ContentPanel title="Operation settings" titleSize="s">
      <Field name="interval" validate={validatePositiveInteger}>
        {({ field, form }: FieldProps) => (
          <EuiFlexGroup>
            <EuiFlexItem style={{ maxWidth: '70%' }}>
              <FormattedFormRow
                fullWidth
                title="Detector interval"
                hint="Define how often the detector collects data to generate
                anomalies. The shorter the interval is, the more real time the 
                detector results will be, and the more computing resources the 
                detector will need."
                hintLink={`${BASE_DOCS_LINK}/ad`}
                isInvalid={isInvalid(field.name, form)}
                error={getError(field.name, form)}
              >
                <EuiFlexGroup gutterSize="s" alignItems="center">
                  <EuiFlexItem grow={false}>
                    <EuiFieldNumber
                      name="detectionInterval"
                      id="detectionInterval"
                      placeholder="Detector interval"
                      data-test-subj="detectionInterval"
                      min={1}
                      {...field}
                    />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiText>
                      <p className="minutes">minutes</p>
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </FormattedFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        )}
      </Field>
      <Field name="windowDelay" validate={validateNonNegativeInteger}>
        {({ field, form }: FieldProps) => (
          <FormattedFormRow
            fullWidth
            title="Window delay"
            hint="Specify a window of delay for a detector to fetch data, if you
            need to account for extra processing time."
            hintLink={`${BASE_DOCS_LINK}/ad`}
            isInvalid={isInvalid(field.name, form)}
            error={getError(field.name, form)}
            style={{ marginTop: '16px' }}
          >
            <EuiFlexGroup gutterSize="s" alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiFieldNumber
                  name="windowDelay"
                  id="windowDelay"
                  placeholder="Window delay"
                  data-test-subj="windowDelay"
                  {...field}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText>
                  <p className="minutes">minutes</p>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </FormattedFormRow>
        )}
      </Field>
    </ContentPanel>
  );
};
