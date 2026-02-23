import { FormLabel } from '@/components/FormLabel';
import { Select } from '@/components/Select';
import { filterOptions } from '../InputAddress/helpers';
import { ILocationSelectorProps } from '@/interfaces';
import { Col, Row } from 'antd';
import { FormLabelError } from '@/index';

export const LocationSelector = (props: ILocationSelectorProps) => {
  const {
    optionsCountries,
    optionsProvinces,
    optionsCantons,
    optionsParishes,
    onChangeCountry,
    onChangeProvince,
    onChangeCanton,
    onChangeParish,
    valueCountryId,
    valueProvinceId,
    valueCantonId,
    valueParishId,
    showParish,
    isLoadingCountries,
    isLoadingProvinces,
    isLoadingCantons,
    isLoadingParishes,
    showProvince,
    showCanton,
    allowClear = true,
    titleCountry = 'País',
    titleProvince = 'Provincia',
    titleCanton = 'Cantón',
    titleParish = 'Parroquia',
    errorCountry,
    errorProvince,
    errorCanton,
    errorParish,
  } = props;

  return (
    <Row gutter={4}>
      <Col
        xs={{ flex: '100%' }}
        sm={{ flex: '50%' }}
        md={{ flex: '50%' }}
        lg={{ flex: '50%' }}
        xl={{ flex: '50%' }}
        className='flex flex-col gap-0.5'
      >
        <FormLabel label={titleCountry} />
        <Select
          options={optionsCountries}
          status={errorCountry ? 'error' : undefined}
          showSearch
          filterOption={(input, option) => filterOptions(input, option)}
          onChange={onChangeCountry}
          loading={isLoadingCountries}
          value={valueCountryId}
          placeholder={titleCountry}
          className="w-full"
          allowClear={allowClear}
        />
        {errorCountry && <FormLabelError label={errorCountry} />}
      </Col>
      <Col
        xs={{ flex: '100%' }}
        sm={{ flex: '50%' }}
        md={{ flex: '50%' }}
        lg={{ flex: '50%' }}
        xl={{ flex: '50%' }}>
        {showProvince && (
          <div className='flex flex-col gap-0.5'>
            <FormLabel label={titleProvince} />
            <Select
              options={optionsProvinces}
              status={errorProvince ? 'error' : undefined}
              showSearch
              filterOption={(input, option) => filterOptions(input, option)}
              onChange={onChangeProvince}
              loading={isLoadingProvinces}
              value={valueProvinceId !== 0 ? valueProvinceId : undefined}
              placeholder={titleProvince}
              className="w-full"
              allowClear={allowClear}
            />
            {errorProvince && <FormLabelError label={errorProvince} />}
          </div>
        )}
      </Col>
      <Col
        xs={{ flex: '100%' }}
        sm={{ flex: '50%' }}
        md={{ flex: '50%' }}
        lg={{ flex: '50%' }}
        xl={{ flex: '50%' }}>
        {showCanton && (
          <div className='flex flex-col gap-0.5'>
            <FormLabel label={titleCanton} />
            <Select
              options={optionsCantons}
              status={errorCanton ? 'error' : undefined}
              showSearch
              filterOption={(input, option) => filterOptions(input, option)}
              onChange={onChangeCanton}
              loading={isLoadingCantons}
              value={valueCantonId !== 0 ? valueCantonId : undefined}
              placeholder={titleCanton}
              className="w-full"
              allowClear={allowClear}
            />
            {errorCanton && <FormLabelError label={errorCanton} />}
          </div>
        )}
      </Col>
      <Col
        xs={{ flex: '100%' }}
        sm={{ flex: '50%' }}
        md={{ flex: '50%' }}
        lg={{ flex: '50%' }}
        xl={{ flex: '50%' }}>
        {showParish && (
          <div className='flex flex-col gap-0.5'>
            <FormLabel label={titleParish} />
            <Select
              options={optionsParishes}
              status={errorParish ? 'error' : undefined}
              showSearch
              filterOption={(input, option) => filterOptions(input, option)}
              onChange={onChangeParish}
              loading={isLoadingParishes}
              value={valueParishId !== 0 ? valueParishId : undefined}
              placeholder={titleParish}
              className="w-full"
              allowClear={allowClear}
            />
            {errorParish && <FormLabelError label={errorParish} />}
          </div>
        )}
      </Col>
    </Row>
  );
};
