import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from 'hooks/useResponsive';
import { TreatmentCalendar } from './TreatmentCalendar/TreatmentCalendar';
import { TreatmentPanel } from './TreatmentPanel/TreatmentPanel';
import { AppDate, Dates } from 'constants/Dates';
import { Col, Row } from 'antd';
import { DashboardCard } from '../DashboardCard/DashboardCard';
import { getUser, User } from 'api/users.api';
import { CalendarEvent, getUserCalendar } from 'api/calendar.api';

export const TreatmentCard: React.FC = () => {
  const { isTablet } = useResponsive();

  const [selectedDate, setDate] = useState<AppDate>(Dates.getToday());
  const [isDateClicked, setDateClicked] = useState(false);
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then((res) => setUser(res));
  }, []);

  useEffect(() => {
    user && getUserCalendar(user?.id).then((res) => setCalendar(res));
  }, [user]);

  const { i18n, t } = useTranslation();

  useEffect(() => {
    setDate(selectedDate.locale(i18n.language));
  }, [i18n.language]);

  const handleDecreaseMonth = () => {
    setDate(selectedDate.month(selectedDate.month() - 1));
  };

  const handleIncreaseMonth = () => {
    setDate(selectedDate.month(selectedDate.month() + 1));
  };

  const handleToday = () => {
    setDate(Dates.getToday());
  };

  const calendarItem = (
    <TreatmentCalendar
      calendar={calendar}
      date={selectedDate}
      setDate={setDate}
      onDecrease={handleDecreaseMonth}
      onIncrease={handleIncreaseMonth}
      onToday={handleToday}
      setDateClicked={setDateClicked}
    />
  );

  const currentEvent = calendar.find((event) => Dates.getDate(event.date).isSame(selectedDate, 'date'));

  const panelItem = <TreatmentPanel event={currentEvent} />;

  return (
    <DashboardCard title={t('dashboard.treatmentPlan.title')}>
      <Row gutter={[10, 10]} wrap={false}>
        {isTablet ? (
          <>
            <Col md={15} xl={12}>
              {calendarItem}
            </Col>
            <Col md={9} xl={12}>
              {panelItem}
            </Col>
          </>
        ) : isDateClicked && calendar.some((event) => Dates.getDate(event.date).isSame(selectedDate, 'date')) ? (
          <Col>{panelItem}</Col>
        ) : (
          <Col>{calendarItem}</Col>
        )}
      </Row>
    </DashboardCard>
  );
};
