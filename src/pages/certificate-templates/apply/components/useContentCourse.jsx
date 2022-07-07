import React, {useState, useCallback, useEffect} from 'react';
// Components
import Courses from "@src/services/api/accounts/Courses";
import {Space, Typography} from "antd";
import {AlertIcon} from "@src/assets/icons/icons-pack";
import RemoveConfirmation from '@src/pages/certificate-templates/apply/components/RemoveConfirmation';

// Hooks
import {useMui} from "@src/hooks/useMui";
import {useParams} from "react-router-dom";
import MuiTag from "@src/components/shared/MuiTag";

const courses = [
  {
    id: 1,
    img: 'image',
    status: false,
    title: 'First Course',
    level: 'beginner',
    author: 'by Arnold Smith',
    duration: 85,
    lessons: 14,
    languages: ['English', 'Deutsch', 'Espanol']
  },
  {
    id: 2,
    img: 'image',
    status: false,
    title: 'Second Course',
    level: 'beginner',
    author: 'by Arnold Smith',
    duration: 85,
    lessons: 14,
    languages: ['English', 'Deutsch', 'Espanol']
  },
  {
    id: 3,
    img: 'image',
    status: false,
    title: 'Third Course',
    level: 'beginner',
    author: 'by Arnold Smith',
    duration: 85,
    lessons: 14,
    languages: ['English', 'Deutsch', 'Espanol']
  },
];

const useContentCourse = (
  courseList,
  setCourseList,
  currentCourseLine,
) => {
  const MuiLMS2Certificate = useMui("LMS2CertificateTemplates");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [defaultCoursesList, setDefaultCoursesList] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentCertificates, setCurrentCertificates] = useState({});
  const [currentCoursesConflicts, setCurrentCoursesConflicts] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  // get from back or current course list
  const [sourceCoursesList, setSourceCoursesList] = useState(courses);
  const [isShowRemoveDialog, setShowRemoveDialog] = useState(false);
  const [listLessons, setListLessons] = useState(selectedCourses);
  /**
   * Load data for filters
   */
  const loadData = () => {
    Courses.all(8).then((result) => {
      setDefaultCoursesList(result.data.response);
      setCoursesList(result.data.response);
    });
  }

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  useEffect(()=> {
   // setActiveCourse(currentCourseLine >= 0 && !courseList[currentCourseLine].editDisable && courseList[currentCourseLine].editStatus);
  }, [currentCourseLine, courseList]);

  useEffect(()=> {
      setListLessons(selectedCourses);
      // setScrCourseList(sourceCoursesList);
    },
    [selectedCourses, sourceCoursesList]);

  /**
   * Search course lists
   * @param search
   * @returns {Promise<unknown>|Promise<unknown[]>}
   */
  const searchData = search => {
    if (search) {
        return Courses.all(null, search).then((result) => {
        setCoursesList(result.data.response);
      });
    }

    return new Promise((resolve) => {
      setCoursesList(defaultCoursesList);
      resolve();
    })
  }

  /**
   * Handling rows selection
   * @type {{onChange: rowSelection.onChange}}
   */
  const rowSelection = {
    onChange: (selectedRowKeys, newSelectedRows) => {
      setSelectedRows(newSelectedRows.map(el => el.id));
    }
  };

  /**
   * Reload data after removing
   */
  const updateAfterRemove = useCallback(() => {
    setSelectedRows([]);
    // remove item from list
    // loadData();
  }, [selectedRows]);

  const {id} = useParams();

  const columnsGroup = [
    {
       // width: '5%',
      title: <MuiTag muiKey="actions" muiGroup="LMS2Reminder" muiDefault="Actions" />,
      render: (row) => (
        <Space
          style={{width: '15rem'}}
          size="middle">
          <RemoveConfirmation
            id={row.id}
            muiKhandleAfterRemove={updateAfterRemove}
            muiKey="remove-course-submit"
            muiGroup="LMS2CertificateTemplates"
            muiDefault="Do you really want to remove this course?"
          />
        </Space>
      )
    },
    {
      title: <MuiLMS2Certificate muiKey="applied-certificate" muiDefault="Applied certificate" />,
      dataIndex: 'appliedCertificate',
      // width: '10%',
      render: () => <Typography.Text
        style={{width: '10rem'}}
        ellipsis={true}>{'View'}</Typography.Text>,
      sorter: (a, b) => (a.appliedCertificate || '').localeCompare(b.appliedCertificate || '')
    },
    {
      title: <MuiTag muiKey="type" muiGroup="LMS2Reminder" muiDefault="Type" />,
      dataIndex: 'courseFormat',
      // width: '10%',
      render: (text) => <Typography.Text
        style={{width: '7rem'}}
        ellipsis={true}>
        {text[0].toUpperCase() + text.substring(1)}
      </Typography.Text>,
      sorter: (a, b) => (a.courseFormat || '').localeCompare(b.courseFormat || '')
    },
    {
      title: <MuiLMS2Certificate muiKey="course-name" muiDefault="Course name" />,
      //width: '25%',
      dataIndex: 'title',
      render: (text) => <Typography.Text
        style={{width: '17rem'}}
        ellipsis={true}>{text}</Typography.Text>,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || '')
    },
    {
      title: <MuiLMS2Certificate muiKey="course-id" muiDefault="Course ID" />,
      //minWidth: '15%',
      dataIndex: 'id',
      render: (text) => <Typography.Text
        style={{width: '10rem'}}
        ellipsis={true}>{text}</Typography.Text>,
      sorter: (a, b) => (a.id || '').localeCompare(b.id || '')
    },
    {
      dataIndex: 'certificateId',
      //width: '10%',
      render: (certId) => <Space size="middle"
                                 style={{width: '2rem !important'}}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {certId >= 0 ?
          certId === Number(id) ? '' : <AlertIcon/>
          : ''}
      </Space>
    }
  ];

  /**
   * Set new page
   * @param newPage
   */
  const handlePaginationChange = newPage => {
    setPage(newPage);
  }

  /**
   * Set page size
   * @param newPageSize
   */
  const handlePageSizeChange = newPageSize => {
    setPage(1);
    setPageSize(newPageSize);
  }

  const onSelectedCourse = (currentId) => {
    const currentCertId = Number(id);
    const selectedList = coursesList.filter(course => currentId.includes(course.course_id));
    console.log("Item==== ", currentId);
    // console.log("Line==== ", selectedListCourses);

    setData(selectedList.map((selectedCourse, index) => {
      // const courseId = selectedCourse.course.course_id;
      const courseId = selectedCourse.course_id;
      // Mocked data - setting the applied certificate to be
      // equal to the index of the course
      if (index === currentCertId && !currentCertificates[courseId]) {
        setCurrentCertificates({...currentCertificates, [courseId]: true})
      }
      if (index !== currentCertId && !currentCertificates[courseId]) {
        setCurrentCoursesConflicts(true);
      }
      return {
        id: selectedCourse.course_id,
        title: selectedCourse.title,
        courseFormat: selectedCourse.course_format,
        certificateId: index
      };
    }));
    if (!selectedList.length) {
      setCurrentCertificates({});
      setCurrentCoursesConflicts(false);
    }
    setTotal(selectedList.length);
    // setSelectedCourses(selectedList);
  }

  return {
    sourceCoursesList,
    setSourceCoursesList,
    selectedCourses,
    setSelectedCourses,
    onSelectedCourse,
    isShowRemoveDialog,
    setShowRemoveDialog,
    coursesList,
    setCoursesList,
    defaultCoursesList,
    setDefaultCoursesList,
    searchData,
    listLessons,
    columnsGroup,
    data,
    selectedRows,
    setSelectedRows,
    rowSelection,
    updateAfterRemove,
    currentCertificates,
    setCurrentCertificates,
    currentCoursesConflicts,
    page,
    pageSize,
    handlePaginationChange,
    handlePageSizeChange,
    total
  }
}

export default useContentCourse;
