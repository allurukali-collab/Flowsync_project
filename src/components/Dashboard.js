import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import time from "../image/time.png";
import reports from "../image/reports.png";
import careers from "../image/careers.png";
import learn from "../image/learn.png";
import Empdash from "../image/Empdash.png";
import more from "../image/more.png";
import doc from "../image/doc.png";
import testimonials from "../image/testimonials.png";
import feed from "../image/feed.png";
import workflow from "../image/workflow.jpg";
import People from "../image/People.jpg";
import about from "../image/about.jpg";

import "./../style/Dashboard.css";
import { getAuthHeaders } from "../utils/api";
import { MODULE_ROUTES } from "../constants/modules";

function safeParseUser() {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parsedUser = safeParseUser();

    if (!parsedUser) {
      navigate("/");
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    if (!user.employeeId) {
      setDashboardData({
        name: user.name || "Employee",
        employeeId: "",
        designation: user.designation || "",
        employeeImage: user.employeeImage,
        allowedModules: [],
      });
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/auth/dashboard/${user.employeeId}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(() => {
        const designation = user.designation?.toUpperCase();

        setDashboardData({
          name: user.name || "Employee",
          employeeId: user.employeeId,
          designation: user.designation || "",
          employeeImage: user.employeeImage,
          allowedModules:
            designation === "INTERN" || designation === "ASE"
              ? ["WORK_TRACKER", "EMPLOYEE_DASHBOARD"]
              : [
                  "WORK_TRACKER",
                  "REPORTS",
                  "CAREERS",
                  "LEARNING",
                  "EMPLOYEE_DASHBOARD",
                  "MORE_APPS",
                  "DOCUMENT_CENTER",
                  "TESTIMONIALS",
                  "FEEDS",
                  "WORKFLOW_DELEGATES",
                  "PEOPLE",
                  "ABOUT",
                ],
        });

        setLoading(false);
      });
  }, [user]);

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const closeImage = () => {
    setIsImageOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const cards = [
    {
      key: "WORK_TRACKER",
      title: "Work Tracker",
      subtitle: "Manage daily work and timesheets",
      image: time,
      route: MODULE_ROUTES.WORK_TRACKER,
    },
    {
      key: "REPORTS",
      title: "Reports",
      subtitle: "View reports and analytics",
      image: reports,
      route: MODULE_ROUTES.REPORTS,
    },
    {
      key: "CAREERS",
      title: "Careers",
      subtitle: "Manage career opportunities",
      image: careers,
      route: MODULE_ROUTES.CAREERS,
    },
    {
      key: "LEARNING",
      title: "Learning",
      subtitle: "Access courses and training",
      image: learn,
      route: MODULE_ROUTES.LEARNING,
    },
    {
      key: "EMPLOYEE_DASHBOARD",
      title: "Employee Dashboard",
      subtitle: "Employee tools and details",
      image: Empdash,
      route: MODULE_ROUTES.EMPLOYEE_DASHBOARD,
    },
    {
      key: "MORE_APPS",
      title: "More Apps",
      subtitle: "Explore additional modules",
      image: more,
      route: MODULE_ROUTES.MORE_APPS,
    },
    {
      key: "DOCUMENT_CENTER",
      title: "Document Center",
      subtitle: "Access company documents",
      image: doc,
      route: MODULE_ROUTES.DOCUMENT_CENTER,
    },
    {
      key: "TESTIMONIALS",
      title: "Testimonials",
      subtitle: "Employee feedback and stories",
      image: testimonials,
      route: MODULE_ROUTES.TESTIMONIALS,
    },
    {
      key: "FEEDS",
      title: "Feeds",
      subtitle: "Latest updates and news",
      image: feed,
      route: MODULE_ROUTES.FEEDS,
    },
    {
      key: "WORKFLOW_DELEGATES",
      title: "Workflow Delegates",
      subtitle: "Manage workflow delegation",
      image: workflow,
      route: MODULE_ROUTES.WORKFLOW_DELEGATES,
    },
    {
      key: "PEOPLE",
      title: "People",
      subtitle: "View people and teams",
      image: People,
      route: MODULE_ROUTES.PEOPLE,
    },
    {
      key: "ABOUT",
      title: "About",
      subtitle: "Company information",
      image: about,
      route: MODULE_ROUTES.ABOUT,
    },
  ];

  const allowedModules = dashboardData?.allowedModules || [];

  const isAllowed = (key) => {
    return allowedModules.includes(key);
  };

  const profileImage =
    dashboardData?.employeeImage || user?.employeeImage
      ? `${process.env.PUBLIC_URL}/images/${
          dashboardData?.employeeImage || user?.employeeImage
        }`
      : `${process.env.PUBLIC_URL}/images/default.png`;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loader"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-icon">F</div>

          <div>
            <div className="logo-name">FlowSync</div>
            <div className="brand-subtitle">Work Management Portal</div>
          </div>
        </div>

        <div className="user-info">
          <div className="role">
            <div className="name">
              {dashboardData?.name || user?.name || "Employee"}
            </div>

            <div className="empId">
              {dashboardData?.employeeId || user?.employeeId || ""}
              {(dashboardData?.designation || user?.designation) &&
                ` | ${dashboardData?.designation || user?.designation}`}
            </div>
          </div>

          <img
            className="img"
            src={profileImage}
            alt="Profile"
            onClick={handleImageClick}
          />

          <button type="button" className="logout-button" onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>
      </header>

      <section className="dashboard-welcome">
        <div>
          <p className="welcome-small">Welcome Back</p>
          <h2>Manage your work modules in one dashboard</h2>
          <p className="welcome-text">
            Select a module below to continue your work.
          </p>
        </div>

        <div className="welcome-counts">
          <div>
            <span>Total Modules</span>
            <strong>{cards.length}</strong>
          </div>

          <div>
            <span>Allowed</span>
            <strong>{allowedModules.length}</strong>
          </div>
        </div>
      </section>

      <div className="dashboard-container">
        {cards.map((card) => {
          const allowed = isAllowed(card.key);

          return (
            <div
              className={`dashboard-card ${!allowed ? "card-disabled" : ""}`}
              key={card.key}
              onClick={() => {
                if (!allowed) return;
                if (card.route) navigate(card.route);
              }}
            >
              <div className="card-image-box">
                <img src={card.image} alt={card.title} />

                <span className="card-status">
                  {allowed ? "Available" : "Restricted"}
                </span>
              </div>

              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.subtitle}</p>

                <button
                  type="button"
                  className="open-module-button"
                  disabled={!allowed}
                >
                  {allowed ? "Open Module" : "No Access"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isImageOpen && (
        <div className="image-modal" onClick={closeImage}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-button" onClick={closeImage}>
              &times;
            </button>

            <img className="modal-profile-img" src={profileImage} alt="Profile" />

            <h3>{dashboardData?.name || user?.name || "Employee"}</h3>

            <p>
              {dashboardData?.employeeId || user?.employeeId || ""}
              {(dashboardData?.designation || user?.designation) &&
                ` | ${dashboardData?.designation || user?.designation}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;