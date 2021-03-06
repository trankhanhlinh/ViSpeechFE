import { connect } from 'react-redux'
import { getProjectTokenList } from 'redux/token/token.actions'
import { getProjectInfo } from 'redux/project/project.actions'
import ProjectDetailsPage from './ProjectDetailsPage.component'

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  getProjectTokenListObj: state.token.getProjectTokenList,
  getProjectInfoObj: state.project.getInfo,
})

const mapDispatchToProps = dispatch => ({
  getProjectInfo: projectId => dispatch(getProjectInfo(projectId)),
  getProjectTokens: ({ userId, projectId, pageIndex, pageSize }) =>
    dispatch(getProjectTokenList({ userId, projectId, pageIndex, pageSize })),
})

const ProjectDetailsPageContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectDetailsPage)

export default ProjectDetailsPageContainer
