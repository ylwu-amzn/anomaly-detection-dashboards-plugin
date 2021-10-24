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
  EuiCallOut,
  EuiSpacer
} from '@elastic/eui';
import { Field, FieldProps } from 'formik';
import React, { useState, useEffect } from 'react';
import ContentPanel from '../../../../components/ContentPanel/ContentPanel';
import { getError, isInvalid } from '../../../../utils/utils';
import { validateDetectorDesc } from './utils/validation';
import { FormattedFormRow } from '../../../../components/FormattedFormRow/FormattedFormRow';

interface CustomResultIndexProps {
  isEdit: boolean;
  useDefaultResultIndex?: boolean;
  resultIndex?: string;
}

function CustomResultIndex(props: CustomResultIndexProps) {
  const [showResultIndex, setShowResultIndex] = useState<boolean>(
    false
  );
  console.log('ylwudebuggggg --- rrrestult index : ', props.resultIndex, "is Edit: ", props.isEdit, "result index", props.resultIndex, "show result ", props.isEdit || !!props.resultIndex);

  useEffect(() => {
    // only update this if we're editing and the detector has finally come
    console.log('ylwudebugggggaaaaaaaaaaa --- show resutl index : ', props.isEdit || !!props.resultIndex);
    setShowResultIndex(props.isEdit || !!props.resultIndex);
  }, []);

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
      {props.isEdit ? (
        <EuiFlexItem>
        <EuiCallOut
          data-test-subj="resultIndexReadOnlyCallout"
          title="You can't change the result index after you create the detector."
          color="primary"
          iconType="iInCircle"
          size="s"
        ></EuiCallOut>
        </EuiFlexItem>
      ) : (
        <EuiFlexItem>
        <EuiCallOut
          data-test-subj="cannotEditResultIndexCallout"
          title="You can't change the result index after you create the detector. Make sure that you select a proper index name."
          color="warning"
          iconType="alert"
          size="s"
        ></EuiCallOut>
        </EuiFlexItem>
      )}
      <EuiSpacer size="m" />
      <Field name="resultIndex" >
        {({ field, form }: FieldProps) => (
          <FormattedFormRow
            title="Result index field"
            hint='Specify a unique and descriptive name that is easy to
          recognize. Prefix "anomaly-result-" will be added to the index name you input. For example, 
          if you input "abc" as result index name, the final index name will be "anomaly-result-abc"'
          >
            <EuiFieldText
              id="resultIndex"
              placeholder="Enter result index name"
              prepend="anomaly-result-"
              disabled={props.isEdit}
              {...field}
            />
          </FormattedFormRow>
        )}
      </Field>
    </ContentPanel>
  );
}

export default CustomResultIndex;
