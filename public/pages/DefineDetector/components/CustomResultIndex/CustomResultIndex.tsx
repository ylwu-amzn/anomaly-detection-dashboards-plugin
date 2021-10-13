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

import {
  EuiFlexItem,
  EuiFlexGroup,
  EuiText,
  EuiLink,
  EuiTitle,
  EuiFieldText,
  EuiTextArea,
} from '@elastic/eui';
import { Field, FieldProps } from 'formik';
import React, { useState } from 'react';
import ContentPanel from '../../../../components/ContentPanel/ContentPanel';
import { getError, isInvalid } from '../../../../utils/utils';
import { validateDetectorDesc } from './utils/validation';
import { FormattedFormRow } from '../../../../components/FormattedFormRow/FormattedFormRow';


function CustomResultIndex() {
  const [showResultIndex, setShowResultIndex] = useState<boolean>(
    false
  );

  return (
    <ContentPanel 
    title={
      <EuiFlexGroup direction="row" style={{ margin: '0px' }}>
        <EuiTitle size="s">
          <h2>Result index</h2>
        </EuiTitle>
        <EuiText
          size="m"
          style={{ marginLeft: '18px', marginTop: '5px' }}
          onClick={() => {
            setShowResultIndex(!showResultIndex);
          }}
        >
          <EuiLink>{showResultIndex ? 'Hide' : 'Show'}</EuiLink>
        </EuiText>
      </EuiFlexGroup>
    }
    titleSize="s"
    hideBody={!showResultIndex}>
      <Field name="resultIndex" >
        {({ field, form }: FieldProps) => (
          <FormattedFormRow
            title="ResultIndex"
            hint="Specify a unique and descriptive name that is easy to
          recognize. Suggest using same pattern like ad_<detector id>"
          >
            <EuiFieldText
              name="resultIndex"
              id="resultIndex"
              placeholder="Enter result index name"
              
              {...field}
            />
          </FormattedFormRow>
        )}
      </Field>
    </ContentPanel>
  );
}

export default CustomResultIndex;
