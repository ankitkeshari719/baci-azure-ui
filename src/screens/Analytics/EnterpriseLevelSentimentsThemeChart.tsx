import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  BodyRegularTypography,
  ButtonLabelTypography,
  H2SemiBoldTypography,
  H4RegularTypography,
} from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import { MONTH_SELECTORS, MenuProps } from './const';
import {
  chartInputType,
  formatDateForAPI,
  getEmotionsAsPerCategory,
  getEnterpriseLevelSentimentsTheme,
} from '../../helpers/msal/services';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';
import DateSelector from '../../components/Elements/EnterpriseDashboardPages/DateSelector';

export default function EnterpriseLevelSentimentsThemeChart({
  dashboard,
  team,
}: {
  dashboard?: boolean;

  team: string;
}) {
  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);
  const [heatMapData, setHeatMapData] = useState<any>([]);
  const [sadPercentage, setSadPercentage] = useState<number>();
  const [neutralPercentage, setNeutralPercentage] = useState<number>();
  const [happyPercentage, setHappyPercentage] = useState<number>();
  const [global, dispatch] = React.useContext(GlobalContext);
  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate
      ? global.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate
      ? global.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );
  const [cardsPerPercentage, setCardsPerPercentage] = useState<number>(1);

  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      setPath('basic');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      setPath('enterprise');
    }
  }, [tempLocalUserData]);

  const getChartWidth = () => {
    switch (true) {
      case windowWidth.current <= 1051:
        return '700';
      case windowWidth.current > 1051 && windowWidth.current <= 1150:
        return '750';
      case windowWidth.current >= 1151 && windowWidth.current <= 1199:
        return '800';
      case windowWidth.current >= 1200 && windowWidth.current <= 1300:
        return '900';
      case windowWidth.current >= 1301 && windowWidth.current <= 1400:
        return '1000';
      case windowWidth.current >= 1401 && windowWidth.current <= 1500:
        return '1050';
      case windowWidth.current >= 1500:
        return '1100';
      default:
        return '500';
    }
  };

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsThemes();
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsThemes();
  }, [team]);

  const handleGetEnterpriseLevelSentimentsThemes = async () => {
    const chartInput: chartInputType = {
      userId: 'vishal.gawande@evoltech.com.au',
      roleName: 'Enterprise',
      enterpriseId: 'evoltech0.0751886606959975',
      teamId: '0',
      fromDate: formatDateForAPI(fromDate),
      toDate: formatDateForAPI(toDate),
    };

    await getEmotionsAsPerCategory(chartInput).then(res => {
      if (res.data.length > 0) {
        let data: any[] = [];
        var totalCards = 0;
        var totalHappyCards = 0;
        var totalNeutalCards = 0;
        var totalSadCards = 0;
        res.data.forEach((item: any) => {
          var obj = {
            name: item.groupName,
            data: [
              item.sadCardsLength,
              item.neutralCardsLength,
              item.happyCardsLength,
            ],
          };
          totalCards =
            totalCards +
            item.sadCardsLength +
            item.neutralCardsLength +
            item.happyCardsLength;
          totalHappyCards = totalHappyCards + item.happyCardsLength;
          totalNeutalCards = totalNeutalCards + item.neutralCardsLength;
          totalSadCards = totalSadCards + item.totalSadCards;
          data.push(obj);
        });
        setHeatMapData(data);

        var sadPer =
          (totalSadCards / totalCards) * 100
            ? (totalSadCards / totalCards) * 100
            : 0;
        var neutralPer =
          (totalNeutalCards / totalCards) * 100
            ? (totalNeutalCards / totalCards) * 100
            : 0;
        var happyPer =
          (totalHappyCards / totalCards) * 100
            ? (totalHappyCards / totalCards) * 100
            : 0;

        setSadPercentage(+sadPer.toFixed(2));
        setNeutralPercentage(+neutralPer.toFixed(2));
        setHappyPercentage(+happyPer.toFixed(2));
        if (totalCards == 0) {
          setCardsPerPercentage(1);
        } else {
          setCardsPerPercentage(totalCards / 1000);
        }
      } else {
        setHeatMapData([]);
        setSadPercentage(0);
        setNeutralPercentage(0);
        setHappyPercentage(0);
        setCardsPerPercentage(1);
      }
    });

    // await getEnterpriseLevelSentimentsTheme("10", "16", team).then(
    //   res => {
    //     if (res && res.result) {
    //       setHeatMapData(res.result.series);
    //       setSadPercentage(res.result.sadPercentage);
    //       setNeutralPercentage(res.result.neutralPercentage);
    //       setHappyPercentage(res.result.happyPercentage);
    //     }
    //   },
    //   err => {
    //     console.log('err', err);
    //   }
    // );
  };

  const handleFromDate = (event: SelectChangeEvent) => {
    setFromDate(event.target.value as string);
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
  };

  const options: ApexOptions = {
    //data on the x-axis
    xaxis: {
      categories: ['Sad', 'Neutral', 'Happy'],
    },
    chart: {
      type: 'heatmap',
      height: 350,
      stacked: true,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
      textAnchor: 'start',
      style: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: '12px',
        colors: ['#333333'],
      },
      background: {
        enabled: true,
        foreColor: '#333333',
        borderRadius: 50,
        dropShadow: {
          top: 10,
        },
      },
    },
    stroke: {
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    grid: {
      show: true,
      borderColor: '#ffffff',
      strokeDashArray: 0,
      position: 'front',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 40,
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 1 * cardsPerPercentage,
              to: 25 * cardsPerPercentage,
              color: '#EBF8FF',
            },
            {
              from: 26 * cardsPerPercentage,
              to: 50 * cardsPerPercentage,
              color: '#D6F1FF',
            },
            {
              from: 51 * cardsPerPercentage,
              to: 75 * cardsPerPercentage,
              color: '#C2EBFF',
            },
            {
              from: 76 * cardsPerPercentage,
              to: 100 * cardsPerPercentage,
              color: '#ADE4FF',
            },
            {
              from: 100 * cardsPerPercentage,
              to: 125 * cardsPerPercentage,
              color: '#99DDFF',
            },
            {
              from: 126 * cardsPerPercentage,
              to: 150 * cardsPerPercentage,
              color: '#7CCBF3',
            },
            {
              from: 151 * cardsPerPercentage,
              to: 200 * cardsPerPercentage,
              color: '#57BDEF',
            },
            {
              from: 201 * cardsPerPercentage,
              to: 250 * cardsPerPercentage,
              color: '#44B5EE',
            },
            {
              from: 251 * cardsPerPercentage,
              to: 300 * cardsPerPercentage,
              color: '#32AEEC',
            },
            {
              from: 301 * cardsPerPercentage,
              to: 350 * cardsPerPercentage,
              color: '#1FA6EA',
            },
            {
              from: 351 * cardsPerPercentage,
              to: 400 * cardsPerPercentage,
              color: '#3296d6',
            },
            {
              from: 401 * cardsPerPercentage,
              to: 450 * cardsPerPercentage,
              color: '#4F91CF',
            },
            {
              from: 451 * cardsPerPercentage,
              to: 500 * cardsPerPercentage,
              color: '#3F87CA',
            },
            {
              from: 501 * cardsPerPercentage,
              to: 550 * cardsPerPercentage,
              color: '#357DC0',
            },
            {
              from: 551 * cardsPerPercentage,
              to: 600 * cardsPerPercentage,
              color: '#3072B0',
            },
            {
              from: 601 * cardsPerPercentage,
              to: 650 * cardsPerPercentage,
              color: '#2C68A0',
            },
            {
              from: 651 * cardsPerPercentage,
              to: 700 * cardsPerPercentage,
              color: '#275E90',
            },
            {
              from: 701 * cardsPerPercentage,
              to: 750 * cardsPerPercentage,
              color: '#235380',
            },
            {
              from: 751 * cardsPerPercentage,
              to: 800 * cardsPerPercentage,
              color: '#1F4970',
            },
            {
              from: 801 * cardsPerPercentage,
              to: 850 * cardsPerPercentage,
              color: '#1A3E60',
            },
            {
              from: 851 * cardsPerPercentage,
              to: 900 * cardsPerPercentage,
              color: '#163450',
            },
            {
              from: 901 * cardsPerPercentage,
              to: 950 * cardsPerPercentage,
              color: '#0C1F31',
            },
            {
              from: 951 * cardsPerPercentage,
              to: 1000 * cardsPerPercentage,
              color: '#040A10',
            },
          ],
        },
      },
    },
  };

  React.useEffect(() => {
    const fromDateInput = global.chartStartDate;
    const toDateInput = global.chartEndDate;
    if (
      fromDateInput != '' &&
      fromDateInput != undefined &&
      fromDateInput != null
    ) {
      setFromDate(fromDateInput);
    }
    if (toDateInput != '' && toDateInput != undefined && toDateInput != null) {
      setToDate(toDateInput);
    }
  }, [global.chartStartDate, global.chartEndDate]);
  return (
    <>
      {dashboard ? (
        <ReactApexChart
          series={heatMapData}
          options={options}
          type="heatmap"
          width="518"
          height="320"
        />
      ) : (
        <Grid container spacing={2} sx={{ padding: '48px', overflowY: 'auto' }}>
          {/* Route Path */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Link to={path + '/analytics/'}>Analytics </Link>&nbsp;\ Count
            themes heatmap
          </Grid>
          {/* Back Button & Chart Title */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: '24px',
            }}
          >
            <Icons.ArrowCircleLeftOutline
              size={32}
              style={{
                cursor: 'pointer',
                color: '#159ADD',
              }}
              onClick={() => navigate(-1)}
            />
            <H2SemiBoldTypography
              label="Sentiments - Key Themes Heatmap"
              style={{ color: '#2C69A1', marginLeft: '16px' }}
            />
          </Grid>
          {/* Selector */}
          <Box>
            {' '}
            <DateSelector
              fromDate={fromDate}
              toDate={toDate}
              handleFromDate={handleFromDate}
              handleToDate={handleToDate}
            />{' '}
          </Box>
          {/* Percentage */}
          <Grid
            item
            xs={3}
            sx={{
              padding: '0px !important',
              marginTop: '32px',
            }}
          ></Grid>
          <Grid
            item
            xs={7}
            sx={{
              padding: '0px !important',
              marginTop: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <H4RegularTypography label={sadPercentage?.toString() + '%'} />
              <BodyRegularTypography label="Sad" />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <H4RegularTypography
                label={neutralPercentage?.toString() + '%'}
              />
              <BodyRegularTypography label="Neutral" />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <H4RegularTypography label={happyPercentage?.toString() + '%'} />
              <BodyRegularTypography label="Happy" />
            </Box>
          </Grid>
          {/* Chart  */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ReactApexChart
              options={options}
              series={heatMapData}
              type="heatmap"
              width={getChartWidth()}
              height="500"
            />
          </Grid>
          {/* Color Range Image  */}
          <Grid
            item
            xs={12}
            sx={{
              paddingTop: '8px !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/svgs/Range_Image.svg"></img>
          </Grid>
        </Grid>
      )}
    </>
  );
}
