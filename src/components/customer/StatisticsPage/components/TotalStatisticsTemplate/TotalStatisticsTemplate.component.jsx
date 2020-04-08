/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { Row, Spin, Select, DatePicker, Button, Empty } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import STORAGE from 'utils/storage'
import ReportUtils from 'utils/report.util'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
const { Option } = Select
const { RangePicker } = DatePicker
const {
  TIME_TYPE,
  ONE_DAY_IN_MILLISECONDS,
  RANGE_PICKER_LIMIT,
  getDateNow,
  getTenDatesFromNow,
  getTotalWeeksOfYear,
  getTotalQuarters,
  getOnlyDate,
} = ReportUtils

const TotalStatisticsTemplate = ({
  userId,
  chartOptions,
  statisticsType,
  getUserTotalStatisticsObj,
  getUserTotalStatistics,
}) => {
  // for antd range picker
  const [pickerType, setPickerType] = useState(TIME_TYPE.DATE)
  const [formatRangePicker, setFormatRangePicker] = useState('DD/MM/YYYY')
  const [placeHolderRangePicker, setPlaceHolderRangePicker] = useState([
    'Ngày bắt đầu',
    'Ngày kết thúc',
  ])
  const [valueRangePicker, setValueRangePicker] = useState([getDateNow(), getTenDatesFromNow()])

  const defaultQuarterData = {
    from: { quarter: 0, year: 2020 },
    to: { quarter: 1, year: 2020 },
  }
  const [quarterData, setQuarterData] = useState(defaultQuarterData)
  const [chartData, setChartData] = useState([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    if (userId) {
      const fromDate = getDateNow().valueOf()
      const toDate = getTenDatesFromNow().valueOf()
      setIsButtonDisabled(false)
      getUserTotalStatistics(userId, statisticsType, TIME_TYPE.DATE, { fromDate, toDate })
    }
  }, [userId, statisticsType, getUserTotalStatistics])

  useEffect(() => {
    const statisticalData = getUserTotalStatisticsObj.data
    if (statisticalData.length > 0) {
      const dataChart = []
      statisticalData.forEach(element => {
        dataChart.push({
          display: element.data.display,
          value: element.usedMinutes,
        })
      })
      setChartData(dataChart)
    }
  }, [getUserTotalStatisticsObj])

  const getStatistics = (timeType, queryParams) => {
    STORAGE.setPreferences(
      `'vispeech-user-total-statistics-${statisticsType}'`,
      JSON.stringify(queryParams)
    )
    getUserTotalStatistics(userId, statisticsType, timeType, queryParams)
  }

  const resetData = () => {
    setValueRangePicker([])
    setQuarterData({})
    setChartData([])
    setIsButtonDisabled(true)
  }

  const onChangePickerType = value => {
    setPickerType(value)
    resetData()

    let format = ''
    let placeHolder = []

    if (value === TIME_TYPE.DATE) {
      format = 'DD/MM/YYYY'
      placeHolder = ['Ngày bắt đầu', 'Ngày kết thúc']
    } else if (value === TIME_TYPE.WEEK) {
      format = 'Tuần ww / YYYY'
      placeHolder = ['Tuần bắt đầu', 'Tuần kết thúc']
    } else if (value === TIME_TYPE.MONTH) {
      format = 'MM/YYYY'
      placeHolder = ['Tháng bắt đầu', 'Tháng kết thúc']
    } else if (value === TIME_TYPE.YEAR) {
      format = 'YYYY'
      placeHolder = ['Năm bắt đầu', 'Năm kết thúc']
    }

    setFormatRangePicker(format)
    setPlaceHolderRangePicker(placeHolder)
  }

  const checkDisabledBtn = (value, isStart) => {
    setIsButtonDisabled(true)

    const from = value ? value[0] : valueRangePicker[0]
    const to = value ? value[1] : valueRangePicker[1]
    const fromYear = from && parseInt(from.format('YYYY'))
    const toYear = to && parseInt(to.format('YYYY'))

    if (pickerType !== TIME_TYPE.QUARTER && (!from || !to)) {
      return
    }

    if (pickerType === TIME_TYPE.DATE) {
      const fromDate = new Date(getOnlyDate(from))
      const toDate = new Date(getOnlyDate(to))
      const totalDates = toDate.valueOf() - fromDate.valueOf() + ONE_DAY_IN_MILLISECONDS
      if (totalDates <= ONE_DAY_IN_MILLISECONDS * RANGE_PICKER_LIMIT - 2) {
        setIsButtonDisabled(false)
      }
    } else if (pickerType === TIME_TYPE.WEEK) {
      const fromWeek = parseInt(from.format('w'))
      const toWeek = parseInt(to.format('w'))

      if (fromWeek && toWeek && fromYear && toYear) {
        let totalWeeks = toWeek - fromWeek + 1
        if (fromYear === toYear && fromWeek < toWeek && totalWeeks <= RANGE_PICKER_LIMIT) {
          setIsButtonDisabled(false)
        }
        if (fromYear + 1 === toYear) {
          const totalWeekOfFromYear = getTotalWeeksOfYear(fromYear)
          totalWeeks = totalWeekOfFromYear - fromWeek + 1 + toWeek
          if (totalWeeks <= RANGE_PICKER_LIMIT) {
            setIsButtonDisabled(false)
          }
        }
      }
    } else if (pickerType === TIME_TYPE.MONTH) {
      const fromMonth = parseInt(from.format('M'))
      const toMonth = parseInt(to.format('M'))

      if (fromMonth != null && toMonth != null && fromYear && toYear) {
        let totalMonths = toMonth - fromMonth + 1
        if (fromYear === toYear && fromMonth < toMonth && totalMonths <= RANGE_PICKER_LIMIT) {
          setIsButtonDisabled(false)
        }
        if (fromYear + 1 === toYear) {
          totalMonths = 11 - fromMonth + 1 + toMonth + 1
          if (totalMonths <= RANGE_PICKER_LIMIT) {
            setIsButtonDisabled(false)
          }
        }
      }
    } else if (pickerType === TIME_TYPE.QUARTER) {
      if (isStart == null) {
        if (quarterData.to && quarterData.from) {
          setIsButtonDisabled(false)
        }
        return
      }

      if (isStart && !quarterData.to) return
      if (!isStart && !quarterData.from) return

      const { quarter, year } = isStart ? quarterData.to : quarterData.from
      const selectedQuarter = value && parseInt(value.format('Q'))
      const selectedYear = value && parseInt(value.format('YYYY'))

      if (quarter != null && year && selectedQuarter != null && selectedYear != null) {
        if (isStart) {
          let totalQuarters = quarter - selectedQuarter + 1
          if (
            selectedYear === year &&
            selectedQuarter < quarter &&
            totalQuarters <= RANGE_PICKER_LIMIT
          ) {
            setIsButtonDisabled(false)
          }
          if (selectedYear !== year) {
            totalQuarters = getTotalQuarters(selectedQuarter, selectedYear, quarter, year)
            if (totalQuarters <= RANGE_PICKER_LIMIT) {
              setIsButtonDisabled(false)
            }
          }
        } else {
          let totalQuarters = selectedQuarter - quarter + 1
          if (
            selectedYear === year &&
            quarter < selectedQuarter &&
            totalQuarters <= RANGE_PICKER_LIMIT + 2
          ) {
            setIsButtonDisabled(false)
          }
          if (selectedYear !== year) {
            totalQuarters = getTotalQuarters(quarter, year, selectedQuarter, selectedYear)
            if (totalQuarters <= RANGE_PICKER_LIMIT + 2) {
              setIsButtonDisabled(false)
            }
          }
        }
      }
    } else if (pickerType === TIME_TYPE.YEAR) {
      const totalYears = toYear - fromYear + 1
      if (fromYear < toYear && totalYears <= RANGE_PICKER_LIMIT) {
        setIsButtonDisabled(false)
      }
    }
  }

  const onChangeFromQuarter = value => {
    console.log('onChangeFromQuarter = ', value.format('Q/YYYY'))
    const quarterObj = {
      ...quarterData,
      from: { quarter: parseInt(value.format('Q')), year: parseInt(value.format('YYYY')) },
    }
    setQuarterData(quarterObj)
    checkDisabledBtn(value, true)
  }

  const onChangeToQuarter = value => {
    console.log('onChangeToQuarter = ', value.format('Q/YYYY'))
    const quarterObj = {
      ...quarterData,
      to: { quarter: parseInt(value.format('Q')), year: parseInt(value.format('YYYY')) },
    }
    setQuarterData(quarterObj)
    checkDisabledBtn(value, false)
  }

  const onChangeRangePicker = value => {
    setValueRangePicker(value)
    checkDisabledBtn(value)
  }

  const onClickGetStatistics = () => {
    const queryParams = {}

    const from = valueRangePicker[0]
    const to = valueRangePicker[1]
    const fromYear = from && parseInt(from.format('YYYY'))
    const toYear = to && parseInt(to.format('YYYY'))

    if (pickerType === TIME_TYPE.DATE) {
      console.log('ok from date ', from.format('DD/MM/YYYY'))
      console.log('ok to date ', to.format('DD/MM/YYYY'))
      queryParams.fromDate = from.valueOf()
      queryParams.toDate = to.valueOf()
    } else if (pickerType === TIME_TYPE.WEEK) {
      const fromWeek = parseInt(from.format('w'))
      const toWeek = parseInt(to.format('w'))
      console.log('ok from week ', fromWeek, ', from year', fromYear)
      console.log('ok to week ', toWeek, ', to year', toYear)
      queryParams.weekObj = {
        from: {
          data: fromWeek,
          year: fromYear,
        },
        to: {
          data: toWeek,
          year: toYear,
        },
      }
    } else if (pickerType === TIME_TYPE.MONTH) {
      const fromMonth = parseInt(from.format('M')) - 1
      const toMonth = parseInt(to.format('M')) - 1
      console.log('ok from month ', fromMonth, ', from year', fromYear)
      console.log('ok to month ', toMonth, ', to year', toYear)
      queryParams.monthObj = {
        from: {
          data: fromMonth,
          year: fromYear,
        },
        to: {
          data: toMonth,
          year: toYear,
        },
      }
    } else if (pickerType === TIME_TYPE.QUARTER) {
      const fromQuarter = quarterData.from.quarter
      const quarterFromYear = quarterData.from.year
      const toQuarter = quarterData.to.quarter
      const quarterToYear = quarterData.to.year
      console.log('ok from quarter ', fromQuarter, ', from year', quarterFromYear)
      console.log('ok to quarter ', toQuarter, ', to year', quarterToYear)
      queryParams.quarterObj = {
        from: {
          data: fromQuarter,
          year: quarterFromYear,
        },
        to: {
          data: toQuarter,
          year: quarterToYear,
        },
      }
    } else if (pickerType === TIME_TYPE.YEAR) {
      console.log('ok from year ', fromYear)
      console.log('ok to year ', toYear)
      queryParams.fromYear = fromYear
      queryParams.toYear = toYear
    }

    getStatistics(pickerType, queryParams)
  }

  const dataChart = {
    labels: chartData.map(item => item.display),
    datasets: [
      {
        label: 'Số phút đã dùng (phút)',
        data: chartData.map(item => item.value),
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
      },
    ],
  }

  return (
    <div style={{ position: 'relative' }}>
      {getUserTotalStatisticsObj.isLoading && (
        <div className="statistics-page__loading">
          <Spin indicator={antIcon} />
        </div>
      )}
      <Row>
        <div className="statistics-page__select-type">
          <Select defaultValue={pickerType} style={{ minWidth: 180 }} onChange={onChangePickerType}>
            <Option value={TIME_TYPE.DATE}>Theo ngày</Option>
            <Option value={TIME_TYPE.WEEK}>Theo tuần</Option>
            <Option value={TIME_TYPE.MONTH}>Theo tháng</Option>
            <Option value={TIME_TYPE.QUARTER}>Theo quý</Option>
            <Option value={TIME_TYPE.YEAR}>Theo năm</Option>
          </Select>
          {pickerType === TIME_TYPE.QUARTER ? (
            <>
              <DatePicker
                picker="quarter"
                onChange={onChangeFromQuarter}
                format="quý 0Q/YYYY"
                placeholder="Quý bắt đầu"
              />
              <div style={{ margin: '0px 5px' }}>đến</div>
              <DatePicker
                picker="quarter"
                onChange={onChangeToQuarter}
                format="quý 0Q/YYYY"
                placeholder="Quý kết thúc"
              />
            </>
          ) : (
            <RangePicker
              picker={pickerType}
              onChange={onChangeRangePicker}
              format={formatRangePicker}
              placeholder={placeHolderRangePicker}
              value={valueRangePicker}
            />
          )}
          <Button onClick={onClickGetStatistics} disabled={isButtonDisabled} type="primary">
            Thống kê
          </Button>
        </div>
      </Row>
      <Row>
        <div className="statistics-page__chart">
          {(chartData.length === 0 || getUserTotalStatisticsObj.isLoading) && <Empty />}
          {getUserTotalStatisticsObj.isLoading === false &&
            getUserTotalStatisticsObj.isSuccess === true &&
            chartData.length > 0 && <HorizontalBar data={dataChart} options={chartOptions} />}
        </div>
      </Row>
    </div>
  )
}

export default TotalStatisticsTemplate
