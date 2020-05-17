/* eslint-disable no-underscore-dangle */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as moment from 'moment'
import AntdTable from 'components/common/AntdTable/AntdTable.component'
import { ADMIN_PATH, TOKEN_TYPE, STATUS } from 'utils/constant'

const ProjectDetailsPage = ({
  getProjectInfoObj,
  getProjectTokenListObj,
  updateInfoObj,
  getProjectInfo,
  getProjectTokens,
  updateProjectInfo,
}) => {
  const { id } = useParams()

  useEffect(() => {
    getProjectInfo(id)
  }, [id, getProjectInfo])

  useEffect(() => {
    if (updateInfoObj.isLoading === false && updateInfoObj.isSuccess === true) {
      getProjectInfo(id)
    }
  }, [updateInfoObj, id, getProjectInfo])

  const columns = [
    {
      title: 'Token',
      dataIndex: 'value',
      headerClassName: 'dt-type',
      className: 'dt-type',
      style: { paddingRight: '30px' },
      render: value => (
        <span className="lead tnx-id">
          <div className="copy-wrap w-100">
            <span className="copy-feedback" />
            <em className="fas fa-key" />
            <input type="text" className="copy-address" defaultValue={value} disabled />
            <button
              type="button"
              className="copy-trigger copy-clipboard"
              data-clipboard-text={value}
            >
              <em className="ti ti-files" />
            </button>
          </div>
        </span>
      ),
      width: 250,
    },
    {
      title: 'Loại token',
      dataIndex: 'tokenType',
      headerClassName: 'dt-type',
      className: 'dt-tnxno',
      style: { paddingRight: '30px' },
      filters: [
        { text: TOKEN_TYPE.FREE.viText, value: TOKEN_TYPE.FREE.name },
        { text: TOKEN_TYPE['50-MINS'].viText, value: TOKEN_TYPE['50-MINS'].name },
        { text: TOKEN_TYPE['200-MINS'].viText, value: TOKEN_TYPE['200-MINS'].name },
        { text: TOKEN_TYPE['500-MINS'].viText, value: TOKEN_TYPE['500-MINS'].name },
      ],
      filterMultiple: false,
      render: tokenType => (
        <>
          <span className={`dt-type-md badge badge-outline ${tokenType.class} badge-md`}>
            {tokenType.name}
          </span>
          <span className={`dt-type-sm badge badge-sq badge-outline ${tokenType.class} badge-md`}>
            {tokenType.name}
          </span>
        </>
      ),
      width: 150,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isValid',
      headerClassName: 'dt-token',
      className: 'dt-amount',
      filters: [
        { text: STATUS.VALID.viText, value: STATUS.VALID.name },
        { text: STATUS.INVALID.viText, value: STATUS.INVALID.name },
      ],
      filterMultiple: false,
      render: isValid => (
        <div className="d-flex align-items-center">
          <div className={`data-state ${isValid.cssClass}`} />
          <span className="sub sub-s2" style={{ paddingTop: '0' }}>
            {isValid.viText}
          </span>
        </div>
      ),
      width: 180,
    },
    {
      title: 'Thời gian còn lại',
      dataIndex: 'minutesLeft',
      headerClassName: 'dt-amount',
      headerStyle: { textAlign: 'center' },
      className: 'dt-amount',
      sorter: true,
      render: minutesLeft => <span className="lead">{minutesLeft} phút</span>,
      width: 200,
      align: 'center',
    },
    {
      title: '',
      dataIndex: '_id',
      render: _id => (
        <a
          href={`${ADMIN_PATH}/transaction-details?tokenId=${_id}`}
          className="btn btn-just-icon btn-secondary btn-simple"
        >
          <i className="zmdi zmdi-eye" />
        </a>
      ),
      width: 60,
      align: 'right',
    },
  ]

  useEffect(() => {
    const projectOwnerId = getProjectInfoObj.project.userId
    if (projectOwnerId) {
      const pagination = {
        pageSize: 5,
        current: 1,
      }
      getProjectTokens({ userId: projectOwnerId, projectId: id, pagination })
    }
  }, [getProjectInfoObj.project.userId, id, getProjectTokens])

  const getProjectTokensList = useCallback(
    ({ pagination, sortField, sortOrder, filters }) => {
      const projectOwnerId = getProjectInfoObj.project.userId
      if (projectOwnerId) {
        getProjectTokens({
          userId: projectOwnerId,
          projectId: id,
          pagination,
          sortField,
          sortOrder,
          filters,
        })
      }
    },
    [getProjectInfoObj.project.userId, id, getProjectTokens]
  )

  const onSubmit = event => {
    event.preventDefault()
    const projectId = getProjectInfoObj.project._id
    if (!projectId) {
      return
    }

    const form = event.target
    const data = {
      name: form.elements.name.value,
      description: form.elements.description.value,
    }
    updateProjectInfo(projectId, data)
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">{getProjectInfoObj.project.name}</h4>
          </div>
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <div className="data-details" style={{ flexDirection: 'column' }}>
                <div className="row d-md-flex" style={{ margin: '0px 0px' }}>
                  <div className="fake-class" style={{ paddingRight: '10px' }}>
                    <span className="data-details-title">Tên dự án</span>
                    <span className="data-details-info">
                      <div
                        className="form-group label-floating is-empty"
                        style={{ padding: '0px', margin: '0px' }}
                      >
                        <label className="control-label" />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tên dự án"
                          name="name"
                          defaultValue={getProjectInfoObj.project.name}
                        />
                      </div>
                    </span>
                  </div>
                  <div className="fake-class" style={{ paddingRight: '10px' }}>
                    <span className="data-details-title">Mô tả</span>
                    <span className="data-details-info">
                      <div
                        className="form-group label-floating is-empty"
                        style={{ padding: '0px', margin: '0px' }}
                      >
                        <label className="control-label" />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mô tả"
                          name="description"
                          defaultValue={getProjectInfoObj.project.description}
                        />
                      </div>
                    </span>
                  </div>
                  <div className="fake-class">
                    <span className="data-details-title">Thời gian tạo</span>
                    <span className="data-details-info">
                      {moment(getProjectInfoObj.project.createdDate).format('DD/MM/YYYY hh:mm:ss')}
                    </span>
                  </div>
                  <div className="fake-class">
                    <span className="data-details-title">Thời gian cập nhật</span>
                    <span className="data-details-info">
                      {moment(getProjectInfoObj.project.updatedDate).format('DD/MM/YYYY hh:mm:ss')}
                    </span>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ display: 'flex', justifyContent: 'flex-end', margin: '0px 0px' }}
                >
                  <button type="submit" className="btn btn-primary">
                    Cập nhật
                  </button>
                </div>
              </div>
            </form>
            <div className="gaps-5x" />
            <div className="material-datatables">
              <AntdTable
                dataObj={getProjectTokenListObj.projectTokenList}
                columns={columns}
                fetchData={getProjectTokensList}
                isLoading={getProjectTokenListObj.isLoading}
                pageSize={5}
                scrollY={500}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsPage
