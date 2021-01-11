import React, { useContext } from 'react';
import { utils, user } from '@ohif/core';
//
import ConnectedViewerRetrieveStudyData from '../connectedComponents/ConnectedViewerRetrieveStudyData';
import useQuery from '../customHooks/useQuery';
import AppContext from '../context/AppContext';
import NotFound from './NotFound';

const { urlUtil: UrlUtil } = utils;

function ViewerRouting() {
  const { appConfig = {} } = useContext(AppContext);
  const studyInstanceUIDs = appConfig.studyInstanceUIDs;

  // Set the user's default authToken for outbound DICOMWeb requests.
  // Is only applied if target server does not set `requestOptions` property.
  //
  // See: `getAuthorizationHeaders.js`
  let query = useQuery();
  const authToken = query.get('token');

  if (authToken) {
    user.getAccessToken = () => authToken;
  }

  const studyUIDs = UrlUtil.paramString.parseParam(studyInstanceUIDs);
  const seriesUIDs = []; // for compatibility with ConnectedViewerRetrieveStudyData component

  if (studyUIDs) {
    return (
      <ConnectedViewerRetrieveStudyData
        studyInstanceUIDs={studyUIDs}
        seriesInstanceUIDs={seriesUIDs}
      />
    );
  }

  return (
    <NotFound
      message="Lo lamentamos pero el estudio solicitado no existe."
      showGoBackButton={false}
    />
  );
}

export default ViewerRouting;
