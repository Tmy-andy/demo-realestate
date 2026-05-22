--
-- PostgreSQL database dump
--

\restrict 3tjHiK01pEaaSrVSIIurFDmDLFoH2ItSQK6SyBpsoYiPMHfFr9b8DDI6VpJf7J1

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-22 14:49:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 24577)
-- Name: app; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA app;


ALTER SCHEMA app OWNER TO postgres;

--
-- TOC entry 364 (class 1255 OID 24578)
-- Name: set_updated_at(); Type: FUNCTION; Schema: app; Owner: postgres
--

CREATE FUNCTION app.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION app.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 356 (class 1259 OID 25953)
-- Name: ai_conversations; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.ai_conversations (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    customer_id bigint,
    lead_id bigint,
    analytics_session_id bigint,
    channel_code character varying(30) DEFAULT 'web_chat'::character varying NOT NULL,
    provider_code character varying(30) DEFAULT 'gemini_live'::character varying NOT NULL,
    language_code character varying(10),
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE app.ai_conversations OWNER TO postgres;

--
-- TOC entry 355 (class 1259 OID 25952)
-- Name: ai_conversations_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.ai_conversations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.ai_conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 362 (class 1259 OID 26025)
-- Name: ai_live_events; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.ai_live_events (
    id bigint NOT NULL,
    ai_live_session_id bigint NOT NULL,
    event_type character varying(50) NOT NULL,
    role_code character varying(20),
    transcript_text text,
    audio_url text,
    payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.ai_live_events OWNER TO postgres;

--
-- TOC entry 361 (class 1259 OID 26024)
-- Name: ai_live_events_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.ai_live_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.ai_live_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 360 (class 1259 OID 26001)
-- Name: ai_live_sessions; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.ai_live_sessions (
    id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    websocket_session_key character varying(150),
    ws_url text,
    current_panorama_id bigint,
    current_scene_id bigint,
    mic_started_at timestamp with time zone,
    mic_stopped_at timestamp with time zone,
    connected_at timestamp with time zone DEFAULT now() NOT NULL,
    disconnected_at timestamp with time zone,
    close_reason text,
    metadata jsonb
);


ALTER TABLE app.ai_live_sessions OWNER TO postgres;

--
-- TOC entry 359 (class 1259 OID 26000)
-- Name: ai_live_sessions_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.ai_live_sessions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.ai_live_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 358 (class 1259 OID 25984)
-- Name: ai_messages; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.ai_messages (
    id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    sender_type character varying(20) NOT NULL,
    message_mode character varying(20) DEFAULT 'text'::character varying NOT NULL,
    message_text text,
    audio_url text,
    transcript_text text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_ai_messages_mode CHECK (((message_mode)::text = ANY ((ARRAY['text'::character varying, 'voice'::character varying, 'event'::character varying])::text[]))),
    CONSTRAINT chk_ai_messages_sender CHECK (((sender_type)::text = ANY ((ARRAY['user'::character varying, 'assistant'::character varying, 'system'::character varying])::text[])))
);


ALTER TABLE app.ai_messages OWNER TO postgres;

--
-- TOC entry 357 (class 1259 OID 25983)
-- Name: ai_messages_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.ai_messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.ai_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 298 (class 1259 OID 25341)
-- Name: amenities; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.amenities (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    amenity_category_id bigint,
    icon_code character varying(50),
    name character varying(200) NOT NULL,
    description text,
    is_featured boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE app.amenities OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 25340)
-- Name: amenities_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.amenities ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.amenities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 296 (class 1259 OID 25327)
-- Name: amenity_categories; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.amenity_categories (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.amenity_categories OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 25326)
-- Name: amenity_categories_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.amenity_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.amenity_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 354 (class 1259 OID 25909)
-- Name: analytics_events; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.analytics_events (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    session_id bigint,
    customer_id bigint,
    lead_id bigint,
    panorama_id bigint,
    scene_id bigint,
    menu_item_id bigint,
    event_name character varying(100) NOT NULL,
    event_at timestamp with time zone DEFAULT now() NOT NULL,
    payload jsonb
);


ALTER TABLE app.analytics_events OWNER TO postgres;

--
-- TOC entry 353 (class 1259 OID 25908)
-- Name: analytics_events_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.analytics_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.analytics_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 352 (class 1259 OID 25880)
-- Name: analytics_sessions; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.analytics_sessions (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    customer_id bigint,
    lead_id bigint,
    sales_public_link_id bigint,
    device_type character varying(30),
    browser_name character varying(100),
    language_code character varying(10),
    referrer_url text,
    utm_source character varying(100),
    utm_medium character varying(100),
    utm_campaign character varying(100),
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE app.analytics_sessions OWNER TO postgres;

--
-- TOC entry 351 (class 1259 OID 25879)
-- Name: analytics_sessions_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.analytics_sessions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.analytics_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 348 (class 1259 OID 25804)
-- Name: appointments; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.appointments (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    lead_id bigint,
    customer_id bigint NOT NULL,
    assigned_user_id bigint,
    appointment_type character varying(50) NOT NULL,
    appointment_location character varying(100),
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone,
    status_code character varying(30) DEFAULT 'pending'::character varying NOT NULL,
    notes text,
    created_by_user_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_appointments_status CHECK (((status_code)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'no_show'::character varying])::text[])))
);


ALTER TABLE app.appointments OWNER TO postgres;

--
-- TOC entry 347 (class 1259 OID 25803)
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.appointments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.appointments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 24641)
-- Name: audit_logs; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.audit_logs (
    id bigint NOT NULL,
    actor_user_id bigint,
    entity_name character varying(100) NOT NULL,
    entity_id bigint,
    action_code character varying(50) NOT NULL,
    old_data jsonb,
    new_data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.audit_logs OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24640)
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.audit_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 24625)
-- Name: auth_sessions; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.auth_sessions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    session_token_hash text NOT NULL,
    ip_address inet,
    user_agent text,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone
);


ALTER TABLE app.auth_sessions OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24624)
-- Name: auth_sessions_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.auth_sessions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.auth_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 308 (class 1259 OID 25420)
-- Name: construction_milestones; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.construction_milestones (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    subdivision_code character varying(100),
    phase_name character varying(200) NOT NULL,
    milestone_date date,
    milestone_date_text character varying(100),
    status_code character varying(20) NOT NULL,
    description text,
    progress_image_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    CONSTRAINT chk_construction_milestones_status CHECK (((status_code)::text = ANY ((ARRAY['done'::character varying, 'active'::character varying, 'upcoming'::character varying])::text[])))
);


ALTER TABLE app.construction_milestones OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 25419)
-- Name: construction_milestones_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.construction_milestones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.construction_milestones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 334 (class 1259 OID 25647)
-- Name: customers; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.customers (
    id bigint NOT NULL,
    full_name character varying(150) NOT NULL,
    phone character varying(30) NOT NULL,
    email character varying(255),
    zalo_phone character varying(30),
    facebook_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.customers OWNER TO postgres;

--
-- TOC entry 333 (class 1259 OID 25646)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.customers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 312 (class 1259 OID 25449)
-- Name: floors; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.floors (
    id bigint NOT NULL,
    tower_id bigint NOT NULL,
    floor_number integer NOT NULL,
    floor_label character varying(50),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.floors OWNER TO postgres;

--
-- TOC entry 311 (class 1259 OID 25448)
-- Name: floors_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.floors ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.floors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 282 (class 1259 OID 25201)
-- Name: gallery_folders; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.gallery_folders (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    folder_name character varying(150) NOT NULL,
    media_scope character varying(20) DEFAULT 'mixed'::character varying NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    CONSTRAINT chk_gallery_folders_scope CHECK (((media_scope)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying, 'mixed'::character varying])::text[])))
);


ALTER TABLE app.gallery_folders OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 25200)
-- Name: gallery_folders_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.gallery_folders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.gallery_folders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 284 (class 1259 OID 25217)
-- Name: gallery_items; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.gallery_items (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    gallery_folder_id bigint,
    subdivision_code character varying(100),
    scene_id bigint,
    media_type character varying(20) NOT NULL,
    source_provider character varying(30) DEFAULT 'external'::character varying NOT NULL,
    title character varying(200) NOT NULL,
    source_url text NOT NULL,
    poster_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_gallery_items_provider CHECK (((source_provider)::text = ANY ((ARRAY['local'::character varying, 'drive'::character varying, 'youtube'::character varying, 'vimeo'::character varying, 'upload'::character varying, 'mp4'::character varying, 'webm'::character varying, 'external'::character varying])::text[]))),
    CONSTRAINT chk_gallery_items_type CHECK (((media_type)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying])::text[])))
);


ALTER TABLE app.gallery_items OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 25216)
-- Name: gallery_items_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.gallery_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.gallery_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 290 (class 1259 OID 25284)
-- Name: key_visual_groups; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.key_visual_groups (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(150) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.key_visual_groups OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 25283)
-- Name: key_visual_groups_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.key_visual_groups ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.key_visual_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 292 (class 1259 OID 25298)
-- Name: key_visual_items; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.key_visual_items (
    id bigint NOT NULL,
    key_visual_group_id bigint NOT NULL,
    title character varying(200) NOT NULL,
    resource_type character varying(30) NOT NULL,
    provider character varying(30) DEFAULT 'external'::character varying NOT NULL,
    resource_url text NOT NULL,
    preview_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    CONSTRAINT chk_key_visual_items_type CHECK (((resource_type)::text = ANY ((ARRAY['folder'::character varying, 'file'::character varying, 'pdf'::character varying, 'image'::character varying, 'video'::character varying, 'link'::character varying])::text[])))
);


ALTER TABLE app.key_visual_items OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 25297)
-- Name: key_visual_items_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.key_visual_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.key_visual_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 239 (class 1259 OID 24783)
-- Name: languages; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.languages (
    id bigint NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE app.languages OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24782)
-- Name: languages_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.languages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.languages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 363 (class 1259 OID 26076)
-- Name: lead_assignment_counters; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.lead_assignment_counters (
    project_id bigint NOT NULL,
    last_user_id bigint,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.lead_assignment_counters OWNER TO postgres;

--
-- TOC entry 346 (class 1259 OID 25782)
-- Name: lead_assignments; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.lead_assignments (
    id bigint NOT NULL,
    lead_id bigint NOT NULL,
    user_id bigint NOT NULL,
    assigned_by_user_id bigint,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL,
    unassigned_at timestamp with time zone
);


ALTER TABLE app.lead_assignments OWNER TO postgres;

--
-- TOC entry 345 (class 1259 OID 25781)
-- Name: lead_assignments_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.lead_assignments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.lead_assignments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 342 (class 1259 OID 25748)
-- Name: lead_consents; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.lead_consents (
    id bigint NOT NULL,
    lead_id bigint NOT NULL,
    channel_code character varying(30) NOT NULL,
    granted boolean NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_lead_consents_channel CHECK (((channel_code)::text = ANY ((ARRAY['zalo'::character varying, 'sms'::character varying, 'email'::character varying, 'call'::character varying])::text[])))
);


ALTER TABLE app.lead_consents OWNER TO postgres;

--
-- TOC entry 341 (class 1259 OID 25747)
-- Name: lead_consents_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.lead_consents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.lead_consents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 336 (class 1259 OID 25658)
-- Name: lead_sources; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.lead_sources (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    source_group character varying(100) NOT NULL,
    source_code character varying(100) NOT NULL,
    source_name character varying(150) NOT NULL,
    is_paid boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.lead_sources OWNER TO postgres;

--
-- TOC entry 335 (class 1259 OID 25657)
-- Name: lead_sources_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.lead_sources ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.lead_sources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 344 (class 1259 OID 25763)
-- Name: lead_status_history; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.lead_status_history (
    id bigint NOT NULL,
    lead_id bigint NOT NULL,
    old_status_code character varying(30),
    new_status_code character varying(30) NOT NULL,
    changed_by_user_id bigint,
    note text,
    changed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.lead_status_history OWNER TO postgres;

--
-- TOC entry 343 (class 1259 OID 25762)
-- Name: lead_status_history_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.lead_status_history ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.lead_status_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 340 (class 1259 OID 25696)
-- Name: leads; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.leads (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    source_id bigint,
    assigned_user_id bigint,
    sales_public_link_id bigint,
    interested_property_id bigint,
    interested_property_type_id bigint,
    source_label_raw character varying(150),
    budget_label character varying(100),
    budget_min_vnd numeric(18,2),
    budget_max_vnd numeric(18,2),
    purchase_purpose character varying(50),
    purchase_timing character varying(100),
    customer_note text,
    crm_note text,
    status_code character varying(30) DEFAULT 'new'::character varying NOT NULL,
    pipeline_stage character varying(30) DEFAULT 'lead'::character varying NOT NULL,
    created_from character varying(50) DEFAULT 'web_form'::character varying NOT NULL,
    is_manual boolean DEFAULT false NOT NULL,
    first_contact_at timestamp with time zone,
    last_contact_at timestamp with time zone,
    closed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_leads_pipeline CHECK (((pipeline_stage)::text = ANY ((ARRAY['lead'::character varying, 'appointment'::character varying, 'hold'::character varying, 'deposit'::character varying, 'won'::character varying, 'lost'::character varying])::text[]))),
    CONSTRAINT chk_leads_status CHECK (((status_code)::text = ANY ((ARRAY['new'::character varying, 'called'::character varying, 'interested'::character varying, 'qualified'::character varying, 'closed'::character varying, 'stopped'::character varying, 'lost'::character varying])::text[])))
);


ALTER TABLE app.leads OWNER TO postgres;

--
-- TOC entry 339 (class 1259 OID 25695)
-- Name: leads_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.leads ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.leads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 300 (class 1259 OID 25362)
-- Name: legal_documents; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.legal_documents (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    subdivision_code character varying(100),
    document_name character varying(200) NOT NULL,
    document_number character varying(150),
    detail_text text,
    file_url text,
    issued_on date,
    is_completed boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.legal_documents OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 25361)
-- Name: legal_documents_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.legal_documents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.legal_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 274 (class 1259 OID 25135)
-- Name: masterplan_categories; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.masterplan_categories (
    id bigint NOT NULL,
    masterplan_id bigint NOT NULL,
    code character varying(50) NOT NULL,
    label character varying(150) NOT NULL,
    icon_code character varying(50),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.masterplan_categories OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 25134)
-- Name: masterplan_categories_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.masterplan_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.masterplan_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 278 (class 1259 OID 25173)
-- Name: masterplan_filter_groups; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.masterplan_filter_groups (
    id bigint NOT NULL,
    masterplan_id bigint NOT NULL,
    code character varying(50) NOT NULL,
    label character varying(150) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.masterplan_filter_groups OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 25172)
-- Name: masterplan_filter_groups_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.masterplan_filter_groups ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.masterplan_filter_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 280 (class 1259 OID 25187)
-- Name: masterplan_filter_options; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.masterplan_filter_options (
    id bigint NOT NULL,
    filter_group_id bigint NOT NULL,
    option_code character varying(50) NOT NULL,
    label character varying(150) NOT NULL,
    color_hex character varying(20),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.masterplan_filter_options OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 25186)
-- Name: masterplan_filter_options_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.masterplan_filter_options ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.masterplan_filter_options_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 276 (class 1259 OID 25149)
-- Name: masterplan_markers; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.masterplan_markers (
    id bigint NOT NULL,
    masterplan_id bigint NOT NULL,
    marker_code character varying(100) NOT NULL,
    category_code character varying(50),
    label character varying(200) NOT NULL,
    description text,
    x_pct numeric(6,2) NOT NULL,
    y_pct numeric(6,2) NOT NULL,
    menu_item_id bigint,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_masterplan_markers_x CHECK (((x_pct >= (0)::numeric) AND (x_pct <= (100)::numeric))),
    CONSTRAINT chk_masterplan_markers_y CHECK (((y_pct >= (0)::numeric) AND (y_pct <= (100)::numeric)))
);


ALTER TABLE app.masterplan_markers OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 25148)
-- Name: masterplan_markers_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.masterplan_markers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.masterplan_markers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 272 (class 1259 OID 25114)
-- Name: masterplans; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.masterplans (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    image_url text,
    intro_text text,
    updated_by_user_id bigint,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.masterplans OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 25113)
-- Name: masterplans_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.masterplans ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.masterplans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 254 (class 1259 OID 24946)
-- Name: menu_groups; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_groups (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    parent_menu_item_id bigint,
    code character varying(100) NOT NULL,
    display_name character varying(150) NOT NULL,
    short_code character varying(10),
    icon_code character varying(50),
    sort_order integer DEFAULT 0 NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE app.menu_groups OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 24945)
-- Name: menu_groups_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.menu_groups ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.menu_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 259 (class 1259 OID 25006)
-- Name: menu_item_detail_images; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_item_detail_images (
    id bigint NOT NULL,
    menu_item_id bigint NOT NULL,
    image_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.menu_item_detail_images OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 25005)
-- Name: menu_item_detail_images_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.menu_item_detail_images ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.menu_item_detail_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 261 (class 1259 OID 25020)
-- Name: menu_item_detail_specs; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_item_detail_specs (
    id bigint NOT NULL,
    menu_item_id bigint NOT NULL,
    label character varying(200) NOT NULL,
    value_text character varying(200),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.menu_item_detail_specs OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 25019)
-- Name: menu_item_detail_specs_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.menu_item_detail_specs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.menu_item_detail_specs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 257 (class 1259 OID 24993)
-- Name: menu_item_details; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_item_details (
    menu_item_id bigint NOT NULL,
    title character varying(200),
    subtitle character varying(150),
    category character varying(150),
    description text
);


ALTER TABLE app.menu_item_details OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 25044)
-- Name: menu_item_subdivision_facts; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_item_subdivision_facts (
    id bigint NOT NULL,
    menu_item_id bigint NOT NULL,
    label character varying(200) NOT NULL,
    value_text character varying(200),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.menu_item_subdivision_facts OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 25043)
-- Name: menu_item_subdivision_facts_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.menu_item_subdivision_facts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.menu_item_subdivision_facts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 266 (class 1259 OID 25056)
-- Name: menu_item_subdivision_points; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_item_subdivision_points (
    id bigint NOT NULL,
    menu_item_id bigint NOT NULL,
    point_text text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.menu_item_subdivision_points OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 25055)
-- Name: menu_item_subdivision_points_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.menu_item_subdivision_points ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.menu_item_subdivision_points_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 262 (class 1259 OID 25031)
-- Name: menu_item_subdivisions; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_item_subdivisions (
    menu_item_id bigint NOT NULL,
    name character varying(200),
    description text,
    cover_url text,
    video_url text
);


ALTER TABLE app.menu_item_subdivisions OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 24962)
-- Name: menu_items; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.menu_items (
    id bigint NOT NULL,
    menu_group_id bigint NOT NULL,
    panorama_id bigint,
    scene_id bigint,
    item_code character varying(100) NOT NULL,
    label character varying(200) NOT NULL,
    description text,
    external_url text,
    hotspot_code character varying(100),
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE app.menu_items OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 24961)
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.menu_items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.menu_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 306 (class 1259 OID 25407)
-- Name: nearby_places; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.nearby_places (
    id bigint NOT NULL,
    project_location_id bigint NOT NULL,
    category_code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    distance_km numeric(8,2),
    distance_text character varying(50),
    travel_minutes integer,
    travel_time_text character varying(50),
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE app.nearby_places OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 25406)
-- Name: nearby_places_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.nearby_places ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.nearby_places_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 248 (class 1259 OID 24878)
-- Name: panorama_assets; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.panorama_assets (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    panorama_code character varying(120) NOT NULL,
    source_hex_key character varying(160),
    title character varying(200),
    thumbnail_url text,
    media_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.panorama_assets OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 24877)
-- Name: panorama_assets_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.panorama_assets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.panorama_assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 24758)
-- Name: project_card_highlights; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_card_highlights (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    icon_code character varying(50),
    label character varying(200) NOT NULL,
    value_text character varying(200),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.project_card_highlights OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 24757)
-- Name: project_card_highlights_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_card_highlights ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_card_highlights_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 24739)
-- Name: project_card_overviews; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_card_overviews (
    project_id bigint NOT NULL,
    description text,
    updated_by_user_id bigint,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.project_card_overviews OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24770)
-- Name: project_card_quick_links; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_card_quick_links (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    action_code character varying(50) NOT NULL,
    icon_code character varying(50),
    label character varying(200) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    CONSTRAINT chk_card_quick_links_action CHECK (((action_code)::text = ANY ((ARRAY['open-masterplan'::character varying, 'open-phankhu'::character varying, 'open-properties'::character varying, 'open-modal'::character varying])::text[])))
);


ALTER TABLE app.project_card_quick_links OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 24769)
-- Name: project_card_quick_links_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_card_quick_links ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_card_quick_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 304 (class 1259 OID 25392)
-- Name: project_locations; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_locations (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    subdivision_code character varying(100),
    latitude numeric(10,7),
    longitude numeric(10,7),
    map_embed_url text,
    address_text text
);


ALTER TABLE app.project_locations OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 25391)
-- Name: project_locations_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_locations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 24670)
-- Name: project_memberships; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_memberships (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    public_slug character varying(100),
    is_primary_sales boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.project_memberships OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24669)
-- Name: project_memberships_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_memberships ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_memberships_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 288 (class 1259 OID 25260)
-- Name: project_resources; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_resources (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    resource_category_id bigint,
    subdivision_code character varying(100),
    resource_key character varying(100) NOT NULL,
    title character varying(200) NOT NULL,
    resource_type character varying(30) NOT NULL,
    provider character varying(30) DEFAULT 'external'::character varying NOT NULL,
    resource_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    CONSTRAINT chk_project_resources_type CHECK (((resource_type)::text = ANY ((ARRAY['folder'::character varying, 'file'::character varying, 'pdf'::character varying, 'image'::character varying, 'video'::character varying, 'link'::character varying])::text[])))
);


ALTER TABLE app.project_resources OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 25259)
-- Name: project_resources_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_resources ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_resources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 24719)
-- Name: project_settings; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_settings (
    project_id bigint NOT NULL,
    publish_mode character varying(30) DEFAULT 'manual_export'::character varying NOT NULL,
    ai_ws_url text,
    crm_api_key_enc text,
    google_maps_api_key_enc text,
    backup_policy_json jsonb,
    feature_flags_json jsonb,
    updated_by_user_id bigint,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_project_settings_publish_mode CHECK (((publish_mode)::text = ANY ((ARRAY['manual_export'::character varying, 'api_publish'::character varying])::text[])))
);


ALTER TABLE app.project_settings OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 25315)
-- Name: project_statistics; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_statistics (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    subdivision_code character varying(100),
    label character varying(200) NOT NULL,
    unit_label character varying(50),
    value_text character varying(100) NOT NULL,
    numeric_value numeric(18,4),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.project_statistics OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 25314)
-- Name: project_statistics_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_statistics ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_statistics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 302 (class 1259 OID 25377)
-- Name: project_testimonials; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_testimonials (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    subdivision_code character varying(100),
    initials character varying(20),
    customer_role character varying(150),
    unit_label character varying(150),
    testimonial_text text NOT NULL,
    avatar_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE app.project_testimonials OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 25376)
-- Name: project_testimonials_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_testimonials ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_testimonials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 246 (class 1259 OID 24854)
-- Name: project_themes; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_themes (
    project_id bigint NOT NULL,
    active_theme_preset_id bigint,
    custom_tokens_json jsonb,
    effects_json jsonb,
    updated_by_user_id bigint,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.project_themes OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24803)
-- Name: project_translations; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_translations (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    language_id bigint NOT NULL,
    translation_key_id bigint NOT NULL,
    translated_text text NOT NULL,
    updated_by_user_id bigint,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.project_translations OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 24802)
-- Name: project_translations_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_translations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 24698)
-- Name: project_versions; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.project_versions (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    version_no integer NOT NULL,
    version_type character varying(30) NOT NULL,
    snapshot_json jsonb NOT NULL,
    note text,
    created_by_user_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    published_at timestamp with time zone,
    CONSTRAINT chk_project_versions_type CHECK (((version_type)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'import'::character varying, 'backup'::character varying])::text[])))
);


ALTER TABLE app.project_versions OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24697)
-- Name: project_versions_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.project_versions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.project_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 24655)
-- Name: projects; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.projects (
    id bigint NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    tagline text,
    location_text text,
    developer_name character varying(200),
    sales_status character varying(150),
    handover_text character varying(100),
    price_from_text character varying(100),
    price_unit_text character varying(100),
    price_from_vnd numeric(18,2),
    area_range_text character varying(100),
    total_units integer,
    total_towers integer,
    floors_text character varying(100),
    density_pct numeric(5,2),
    green_space_text character varying(150),
    green_space_ha numeric(10,2),
    units_left integer,
    total_units_for_sale integer,
    promo_deadline_at timestamp with time zone,
    timezone_name character varying(100) DEFAULT 'Asia/Ho_Chi_Minh'::character varying NOT NULL,
    logo_url text,
    favicon_url text,
    cover_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.projects OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24654)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.projects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 316 (class 1259 OID 25478)
-- Name: properties; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.properties (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    tower_id bigint,
    floor_id bigint,
    property_type_id bigint,
    scene_id bigint,
    sales_user_id bigint,
    property_code character varying(100) NOT NULL,
    name character varying(200) NOT NULL,
    subdivision_code character varying(100),
    subdivision_label character varying(200),
    type_code character varying(50),
    type_label character varying(100),
    description text,
    area_sqm numeric(10,2),
    bedroom_count smallint,
    bathroom_count smallint,
    floor_number integer,
    facing_direction character varying(100),
    price_vnd numeric(18,2),
    price_display character varying(100),
    price_per_sqm_vnd numeric(18,2),
    price_per_sqm_display character varying(100),
    available_count integer,
    total_count integer,
    legal_text character varying(200),
    handover_text character varying(100),
    status_code character varying(20) DEFAULT 'available'::character varying NOT NULL,
    status_label character varying(100),
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_properties_status CHECK (((status_code)::text = ANY ((ARRAY['available'::character varying, 'holding'::character varying, 'reserved'::character varying, 'sold'::character varying, 'blocked'::character varying, 'off_market'::character varying])::text[])))
);


ALTER TABLE app.properties OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 25477)
-- Name: properties_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.properties ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 326 (class 1259 OID 25581)
-- Name: property_documents; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_documents (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    document_name character varying(200) NOT NULL,
    document_type character varying(30) DEFAULT 'PDF'::character varying NOT NULL,
    document_url text,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.property_documents OWNER TO postgres;

--
-- TOC entry 325 (class 1259 OID 25580)
-- Name: property_documents_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_documents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 320 (class 1259 OID 25539)
-- Name: property_floor_plans; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_floor_plans (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    image_url text NOT NULL,
    label character varying(150),
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.property_floor_plans OWNER TO postgres;

--
-- TOC entry 319 (class 1259 OID 25538)
-- Name: property_floor_plans_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_floor_plans ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_floor_plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 322 (class 1259 OID 25553)
-- Name: property_highlights; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_highlights (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    highlight_text text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.property_highlights OWNER TO postgres;

--
-- TOC entry 321 (class 1259 OID 25552)
-- Name: property_highlights_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_highlights ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_highlights_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 318 (class 1259 OID 25525)
-- Name: property_images; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_images (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    image_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.property_images OWNER TO postgres;

--
-- TOC entry 317 (class 1259 OID 25524)
-- Name: property_images_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_images ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 328 (class 1259 OID 25596)
-- Name: property_milestones; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_milestones (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    phase_name character varying(200) NOT NULL,
    phase_date_text character varying(100),
    is_done boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.property_milestones OWNER TO postgres;

--
-- TOC entry 327 (class 1259 OID 25595)
-- Name: property_milestones_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_milestones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_milestones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 324 (class 1259 OID 25567)
-- Name: property_policies; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_policies (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    policy_text text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.property_policies OWNER TO postgres;

--
-- TOC entry 323 (class 1259 OID 25566)
-- Name: property_policies_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_policies ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_policies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 332 (class 1259 OID 25628)
-- Name: property_price_history; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_price_history (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    price_vnd numeric(18,2),
    price_per_sqm_vnd numeric(18,2),
    effective_from timestamp with time zone DEFAULT now() NOT NULL,
    effective_to timestamp with time zone,
    changed_by_user_id bigint,
    note text
);


ALTER TABLE app.property_price_history OWNER TO postgres;

--
-- TOC entry 331 (class 1259 OID 25627)
-- Name: property_price_history_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_price_history ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_price_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 350 (class 1259 OID 25842)
-- Name: property_reservations; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_reservations (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    property_id bigint NOT NULL,
    lead_id bigint,
    customer_id bigint NOT NULL,
    sales_user_id bigint,
    reservation_type character varying(30) NOT NULL,
    status_code character varying(30) NOT NULL,
    hold_started_at timestamp with time zone,
    hold_expires_at timestamp with time zone,
    deposit_amount_vnd numeric(18,2),
    payment_method character varying(50),
    payment_reference character varying(150),
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_property_reservations_status CHECK (((status_code)::text = ANY ((ARRAY['requested'::character varying, 'holding'::character varying, 'confirmed'::character varying, 'expired'::character varying, 'cancelled'::character varying, 'converted'::character varying])::text[]))),
    CONSTRAINT chk_property_reservations_type CHECK (((reservation_type)::text = ANY ((ARRAY['interest'::character varying, 'hold'::character varying, 'booking'::character varying, 'deposit'::character varying])::text[])))
);


ALTER TABLE app.property_reservations OWNER TO postgres;

--
-- TOC entry 349 (class 1259 OID 25841)
-- Name: property_reservations_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_reservations ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_reservations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 330 (class 1259 OID 25609)
-- Name: property_status_history; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_status_history (
    id bigint NOT NULL,
    property_id bigint NOT NULL,
    old_status_code character varying(20),
    new_status_code character varying(20) NOT NULL,
    changed_by_user_id bigint,
    change_reason text,
    changed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.property_status_history OWNER TO postgres;

--
-- TOC entry 329 (class 1259 OID 25608)
-- Name: property_status_history_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_status_history ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_status_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 314 (class 1259 OID 25463)
-- Name: property_types; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.property_types (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    type_code character varying(50) NOT NULL,
    type_name character varying(100) NOT NULL,
    bedroom_count smallint,
    extra_room_count smallint DEFAULT 0 NOT NULL,
    unit_class character varying(50),
    area_from_sqm numeric(10,2),
    area_to_sqm numeric(10,2),
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE app.property_types OWNER TO postgres;

--
-- TOC entry 313 (class 1259 OID 25462)
-- Name: property_types_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.property_types ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.property_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 286 (class 1259 OID 25246)
-- Name: resource_categories; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.resource_categories (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(150) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.resource_categories OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 25245)
-- Name: resource_categories_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.resource_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.resource_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 24580)
-- Name: roles; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.roles (
    id bigint NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(120) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.roles OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24579)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 338 (class 1259 OID 25674)
-- Name: sales_public_links; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.sales_public_links (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    user_id bigint NOT NULL,
    slug character varying(100) NOT NULL,
    destination_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.sales_public_links OWNER TO postgres;

--
-- TOC entry 337 (class 1259 OID 25673)
-- Name: sales_public_links_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.sales_public_links ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.sales_public_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 270 (class 1259 OID 25085)
-- Name: site_map_points; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.site_map_points (
    id bigint NOT NULL,
    site_map_id bigint NOT NULL,
    panorama_id bigint,
    scene_id bigint,
    point_code character varying(100) NOT NULL,
    label character varying(200) NOT NULL,
    x_pct numeric(6,2) NOT NULL,
    y_pct numeric(6,2) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    CONSTRAINT chk_site_map_points_x CHECK (((x_pct >= (0)::numeric) AND (x_pct <= (100)::numeric))),
    CONSTRAINT chk_site_map_points_y CHECK (((y_pct >= (0)::numeric) AND (y_pct <= (100)::numeric)))
);


ALTER TABLE app.site_map_points OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 25084)
-- Name: site_map_points_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.site_map_points ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.site_map_points_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 268 (class 1259 OID 25070)
-- Name: site_maps; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.site_maps (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    name character varying(150) NOT NULL,
    background_url text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.site_maps OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 25069)
-- Name: site_maps_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.site_maps ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.site_maps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 245 (class 1259 OID 24834)
-- Name: theme_presets; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.theme_presets (
    id bigint NOT NULL,
    project_id bigint,
    preset_name character varying(150) NOT NULL,
    tokens_json jsonb NOT NULL,
    is_system boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by_user_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.theme_presets OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 24833)
-- Name: theme_presets_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.theme_presets ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.theme_presets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 310 (class 1259 OID 25435)
-- Name: towers; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.towers (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    tower_code character varying(50) NOT NULL,
    tower_name character varying(150) NOT NULL,
    total_floors integer,
    total_units integer,
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE app.towers OWNER TO postgres;

--
-- TOC entry 309 (class 1259 OID 25434)
-- Name: towers_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.towers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.towers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 24793)
-- Name: translation_keys; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.translation_keys (
    id bigint NOT NULL,
    namespace_code character varying(100) NOT NULL,
    key_code character varying(255) NOT NULL,
    default_text text
);


ALTER TABLE app.translation_keys OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 24792)
-- Name: translation_keys_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.translation_keys ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.translation_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 24606)
-- Name: user_role_bindings; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.user_role_bindings (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.user_role_bindings OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24605)
-- Name: user_role_bindings_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.user_role_bindings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.user_role_bindings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 24591)
-- Name: users; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.users (
    id bigint NOT NULL,
    username character varying(50) NOT NULL,
    password_hash text NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(255),
    phone character varying(30),
    title character varying(150),
    avatar_url text,
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_users_email CHECK (((email IS NULL) OR (POSITION(('@'::text) IN (email)) > 1)))
);


ALTER TABLE app.users OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24590)
-- Name: users_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 252 (class 1259 OID 24921)
-- Name: vr_hotspots; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.vr_hotspots (
    id bigint NOT NULL,
    scene_id bigint NOT NULL,
    target_scene_id bigint,
    hotspot_code character varying(100) NOT NULL,
    hotspot_type character varying(30) NOT NULL,
    label character varying(200) NOT NULL,
    description text,
    x_ratio numeric(8,6),
    y_ratio numeric(8,6),
    yaw_deg numeric(9,4),
    pitch_deg numeric(9,4),
    media_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    CONSTRAINT chk_vr_hotspots_type CHECK (((hotspot_type)::text = ANY ((ARRAY['info'::character varying, 'nav'::character varying, 'image'::character varying, 'video'::character varying, 'link_unit'::character varying])::text[]))),
    CONSTRAINT chk_vr_hotspots_x CHECK (((x_ratio IS NULL) OR ((x_ratio >= (0)::numeric) AND (x_ratio <= (1)::numeric)))),
    CONSTRAINT chk_vr_hotspots_y CHECK (((y_ratio IS NULL) OR ((y_ratio >= (0)::numeric) AND (y_ratio <= (1)::numeric))))
);


ALTER TABLE app.vr_hotspots OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 24920)
-- Name: vr_hotspots_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.vr_hotspots ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.vr_hotspots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 250 (class 1259 OID 24896)
-- Name: vr_scenes; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.vr_scenes (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    panorama_id bigint,
    scene_code character varying(100) NOT NULL,
    scene_name character varying(200) NOT NULL,
    scene_type character varying(50),
    description text,
    horizon_y numeric(8,4),
    palette_json jsonb,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE app.vr_scenes OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 24895)
-- Name: vr_scenes_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

ALTER TABLE app.vr_scenes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME app.vr_scenes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4484 (class 0 OID 25953)
-- Dependencies: 356
-- Data for Name: ai_conversations; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.ai_conversations (id, project_id, customer_id, lead_id, analytics_session_id, channel_code, provider_code, language_code, started_at, ended_at, metadata) FROM stdin;
\.


--
-- TOC entry 4490 (class 0 OID 26025)
-- Dependencies: 362
-- Data for Name: ai_live_events; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.ai_live_events (id, ai_live_session_id, event_type, role_code, transcript_text, audio_url, payload, created_at) FROM stdin;
\.


--
-- TOC entry 4488 (class 0 OID 26001)
-- Dependencies: 360
-- Data for Name: ai_live_sessions; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.ai_live_sessions (id, conversation_id, websocket_session_key, ws_url, current_panorama_id, current_scene_id, mic_started_at, mic_stopped_at, connected_at, disconnected_at, close_reason, metadata) FROM stdin;
\.


--
-- TOC entry 4486 (class 0 OID 25984)
-- Dependencies: 358
-- Data for Name: ai_messages; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.ai_messages (id, conversation_id, sender_type, message_mode, message_text, audio_url, transcript_text, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 4426 (class 0 OID 25341)
-- Dependencies: 298
-- Data for Name: amenities; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.amenities (id, project_id, amenity_category_id, icon_code, name, description, is_featured, sort_order, is_active) FROM stdin;
\.


--
-- TOC entry 4424 (class 0 OID 25327)
-- Dependencies: 296
-- Data for Name: amenity_categories; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.amenity_categories (id, project_id, code, name, sort_order) FROM stdin;
\.


--
-- TOC entry 4482 (class 0 OID 25909)
-- Dependencies: 354
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.analytics_events (id, project_id, session_id, customer_id, lead_id, panorama_id, scene_id, menu_item_id, event_name, event_at, payload) FROM stdin;
\.


--
-- TOC entry 4480 (class 0 OID 25880)
-- Dependencies: 352
-- Data for Name: analytics_sessions; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.analytics_sessions (id, project_id, customer_id, lead_id, sales_public_link_id, device_type, browser_name, language_code, referrer_url, utm_source, utm_medium, utm_campaign, started_at, ended_at, metadata) FROM stdin;
\.


--
-- TOC entry 4476 (class 0 OID 25804)
-- Dependencies: 348
-- Data for Name: appointments; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.appointments (id, project_id, lead_id, customer_id, assigned_user_id, appointment_type, appointment_location, start_at, end_at, status_code, notes, created_by_user_id, created_at, updated_at) FROM stdin;
1	1	1	1	1	site_visit	\N	2026-05-23 03:37:47.513+00	\N	pending	\N	\N	2026-05-22 03:35:47.513+00	2026-05-22 03:37:47.261563+00
2	1	2	2	1	site_visit	\N	2026-05-23 03:37:47.514+00	\N	pending	\N	\N	2026-05-22 02:52:47.514+00	2026-05-22 03:37:47.261563+00
3	1	4	5	1	site_visit	\N	2026-05-23 03:39:29.3+00	\N	pending	\N	\N	2026-05-22 03:37:29.3+00	2026-05-22 03:39:29.052956+00
4	1	5	6	1	site_visit	\N	2026-05-23 03:39:29.3+00	\N	pending	\N	\N	2026-05-22 02:54:29.3+00	2026-05-22 03:39:29.052956+00
5	1	7	9	1	site_visit	\N	2026-05-23 04:35:23.435+00	\N	pending	\N	\N	2026-05-22 04:33:23.435+00	2026-05-22 04:35:23.209415+00
6	1	8	10	1	site_visit	\N	2026-05-23 04:35:23.436+00	\N	pending	\N	\N	2026-05-22 03:50:23.436+00	2026-05-22 04:35:23.209415+00
7	1	10	13	1	site_visit	\N	2026-05-23 04:38:54.281+00	\N	pending	\N	\N	2026-05-22 04:36:54.281+00	2026-05-22 04:38:53.903655+00
8	1	11	14	1	site_visit	\N	2026-05-23 04:38:54.282+00	\N	pending	\N	\N	2026-05-22 03:53:54.282+00	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4353 (class 0 OID 24641)
-- Dependencies: 225
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.audit_logs (id, actor_user_id, entity_name, entity_id, action_code, old_data, new_data, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 4351 (class 0 OID 24625)
-- Dependencies: 223
-- Data for Name: auth_sessions; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.auth_sessions (id, user_id, session_token_hash, ip_address, user_agent, started_at, expires_at, revoked_at) FROM stdin;
1	1	1464d6e36c86b8f7315a660e0b60046d62add7150b3a4141e277a87a68ce7661	::1	node	2026-05-22 07:16:42.995839+00	2026-05-22 19:16:42.995+00	\N
2	22	4afa4dfdbab4fd1d9a842febbe049ca155b77233387f10c41b7a8c7f29e25b0d	::1	node	2026-05-22 07:16:43.068006+00	2026-05-22 19:16:43.067+00	\N
3	21	7b3d3adde87acb28cc5cdac6b4ccf75d60a6d218a57e0ed85cbcb219fc212f9c	::1	node	2026-05-22 07:16:43.13342+00	2026-05-22 19:16:43.133+00	\N
4	22	964535a138bad8797392170f5f81aee88afe22afb257bfd6b2d54a59f31e9b6e	::1	node	2026-05-22 07:19:06.233593+00	2026-05-22 19:19:06.232+00	\N
6	1	e8585784ce6585cc958ef7be4645991a70614d31e6417a05417985829dbb1e6f	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-22 07:25:18.464559+00	2026-05-22 19:25:18.463+00	2026-05-22 07:28:18.868068+00
7	22	521d4e5b98c31282c2155155c42127ad0c6273710a3bca55519c0d568d345855	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-22 07:28:22.773101+00	2026-05-22 19:28:22.771+00	2026-05-22 07:29:12.878111+00
8	22	90f5e075e60825a080df45392b4fa81fd344999cd003e669507b7f95968339dd	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-22 07:30:38.487716+00	2026-05-22 19:30:38.487+00	2026-05-22 07:32:14.045681+00
10	22	5d413e0df18a4bbb226b1c2338c362bc31937d5e642ca851df7f2b266aad64f1	::1	node	2026-05-22 07:34:20.722843+00	2026-05-22 19:34:20.721+00	\N
9	22	c071c8631b09b10b3cbbf74a768fef3801502da3684f5c41ea8a1f701c2bf1c4	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-22 07:32:16.272194+00	2026-05-22 19:32:16.27+00	2026-05-22 07:37:26.098346+00
11	2	fc4357aa554bda4de45692cd3293b0ef4ebcff11aa67c44184400efee2365157	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-22 07:37:34.472467+00	2026-05-22 19:37:34.47+00	\N
\.


--
-- TOC entry 4436 (class 0 OID 25420)
-- Dependencies: 308
-- Data for Name: construction_milestones; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.construction_milestones (id, project_id, subdivision_code, phase_name, milestone_date, milestone_date_text, status_code, description, progress_image_url, sort_order) FROM stdin;
122	1	\N	Khởi công	\N	Q1 / 2024	done	Lễ khởi công tháp A & B với sự tham dự của UBND Hà Nội. Hoàn thành ép cọc móng cọc khoan nhồi D800.	\N	0
123	1	\N	Hoàn thiện phần ngầm	\N	Q3 / 2024	done	Thi công 5 tầng hầm, hệ thống kết cấu móng bè, hoàn thiện tầng kỹ thuật B1.	\N	1
124	1	\N	Thi công thân tháp A	\N	Q4 / 2024	done	Đổ sàn từ tầng 1 đến tầng 20 đúng tiến độ. Lắp đặt hệ thống cơ điện ngầm.	\N	2
125	1	\N	Cất nóc tháp A & B	\N	Q2 / 2026	done	Hoàn thành kết cấu 42 tầng tháp A và 38 tầng tháp B. Đây là mốc quan trọng nhất của dự án.	\N	3
126	1	\N	Mở bán GĐ 2	\N	Q2 / 2026	active	Ra mắt 312 căn giai đoạn 2 với ưu đãi chiết khấu 8% và cam kết thuê lại 7%/năm.	\N	4
127	1	\N	Hoàn thiện ngoại thất	\N	Q1 / 2027	upcoming	Lắp dựng mặt dựng kính Low-E, ốp đá granite ngoại thất, hoàn thiện sảnh tầng 1.	\N	5
128	1	\N	Nghiệm thu & PCCC	\N	Q2 / 2027	upcoming	Kiểm tra nghiệm thu hệ thống PCCC, thang máy, điện nước toàn tòa. Cấp giấy chứng nhận đủ điều kiện.	\N	6
129	1	\N	Bàn giao tháp A	\N	Q4 / 2027	upcoming	Bàn giao toàn bộ 920 căn tháp A kèm sổ hồng dự kiến cấp Q2/2028.	\N	7
130	1	pk-bach-van	Khởi công	\N	Q1 / 2024	done	Lễ khởi công tháp A & B với sự tham dự của UBND Hà Nội. Hoàn thành ép cọc móng cọc khoan nhồi D800.	\N	0
131	1	pk-bach-van	Mở bán GĐ 2	\N	Q2 / 2026	active	Ra mắt 312 căn giai đoạn 2 với ưu đãi chiết khấu 8% và cam kết thuê lại 7%/năm.	\N	1
132	1	pk-vinh-may	Hoàn thiện phần ngầm	\N	Q3 / 2024	done	Thi công 5 tầng hầm, hệ thống kết cấu móng bè, hoàn thiện tầng kỹ thuật B1.	\N	0
133	1	pk-vinh-may	Hoàn thiện ngoại thất	\N	Q1 / 2027	upcoming	Lắp dựng mặt dựng kính Low-E, ốp đá granite ngoại thất, hoàn thiện sảnh tầng 1.	\N	1
134	1	pk-dao-ngoc	Thi công thân tháp A	\N	Q4 / 2024	done	Đổ sàn từ tầng 1 đến tầng 20 đúng tiến độ. Lắp đặt hệ thống cơ điện ngầm.	\N	0
135	1	pk-dao-ngoc	Nghiệm thu & PCCC	\N	Q2 / 2027	upcoming	Kiểm tra nghiệm thu hệ thống PCCC, thang máy, điện nước toàn tòa. Cấp giấy chứng nhận đủ điều kiện.	\N	1
136	1	pk-tinh-van	Cất nóc tháp A & B	\N	Q2 / 2026	done	Hoàn thành kết cấu 42 tầng tháp A và 38 tầng tháp B. Đây là mốc quan trọng nhất của dự án.	\N	0
137	1	pk-tinh-van	Bàn giao tháp A	\N	Q4 / 2027	upcoming	Bàn giao toàn bộ 920 căn tháp A kèm sổ hồng dự kiến cấp Q2/2028.	\N	1
\.


--
-- TOC entry 4462 (class 0 OID 25647)
-- Dependencies: 334
-- Data for Name: customers; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.customers (id, full_name, phone, email, zalo_phone, facebook_url, created_at, updated_at) FROM stdin;
1	Vũ Thị Giang	0901234567	\N	\N	\N	2026-05-22 03:37:47.261563+00	2026-05-22 03:37:47.261563+00
2	Nguyễn Văn An	0902345678	\N	\N	\N	2026-05-22 03:37:47.261563+00	2026-05-22 03:37:47.261563+00
3	Trần Thị Bình	0903456789	\N	\N	\N	2026-05-22 03:37:47.261563+00	2026-05-22 03:37:47.261563+00
4	Lê Hoàng Cường	0904567890	\N	\N	\N	2026-05-22 03:37:47.261563+00	2026-05-22 03:37:47.261563+00
5	Vũ Thị Giang	0901234567	\N	\N	\N	2026-05-22 03:39:29.052956+00	2026-05-22 03:39:29.052956+00
6	Nguyễn Văn An	0902345678	\N	\N	\N	2026-05-22 03:39:29.052956+00	2026-05-22 03:39:29.052956+00
7	Trần Thị Bình	0903456789	\N	\N	\N	2026-05-22 03:39:29.052956+00	2026-05-22 03:39:29.052956+00
8	Lê Hoàng Cường	0904567890	\N	\N	\N	2026-05-22 03:39:29.052956+00	2026-05-22 03:39:29.052956+00
9	Vũ Thị Giang	0901234567	\N	\N	\N	2026-05-22 04:35:23.209415+00	2026-05-22 04:35:23.209415+00
10	Nguyễn Văn An	0902345678	\N	\N	\N	2026-05-22 04:35:23.209415+00	2026-05-22 04:35:23.209415+00
11	Trần Thị Bình	0903456789	\N	\N	\N	2026-05-22 04:35:23.209415+00	2026-05-22 04:35:23.209415+00
12	Lê Hoàng Cường	0904567890	\N	\N	\N	2026-05-22 04:35:23.209415+00	2026-05-22 04:35:23.209415+00
13	Vũ Thị Giang	0901234567	\N	\N	\N	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
14	Nguyễn Văn An	0902345678	\N	\N	\N	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
15	Trần Thị Bình	0903456789	\N	\N	\N	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
16	Lê Hoàng Cường	0904567890	\N	\N	\N	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
17	Khách A	0900000001	\N	\N	\N	2026-05-22 07:19:06.374716+00	2026-05-22 07:19:06.374716+00
18	KháchRR0	090111000	\N	\N	\N	2026-05-22 07:19:06.406222+00	2026-05-22 07:19:06.406222+00
19	KháchRR1	090111001	\N	\N	\N	2026-05-22 07:19:06.418613+00	2026-05-22 07:19:06.418613+00
20	KháchRR2	090111002	\N	\N	\N	2026-05-22 07:19:06.433701+00	2026-05-22 07:19:06.433701+00
21	KháchRR3	090111003	\N	\N	\N	2026-05-22 07:19:06.443486+00	2026-05-22 07:19:06.443486+00
\.


--
-- TOC entry 4440 (class 0 OID 25449)
-- Dependencies: 312
-- Data for Name: floors; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.floors (id, tower_id, floor_number, floor_label, sort_order) FROM stdin;
\.


--
-- TOC entry 4410 (class 0 OID 25201)
-- Dependencies: 282
-- Data for Name: gallery_folders; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.gallery_folders (id, project_id, folder_name, media_scope, sort_order) FROM stdin;
103	1	Tổng quan	mixed	0
104	1	PK Bạch Vân	mixed	1
105	1	PK Đảo Ngọc	mixed	2
106	1	PK Tinh Vân	mixed	3
107	1	PK Vịnh Mây	mixed	4
108	1	TVC	mixed	5
109	1	Mood Film	mixed	6
110	1	Phân tích giá trị	mixed	7
111	1	Vị trí & thị trường	mixed	8
112	1	Thị trường	mixed	9
\.


--
-- TOC entry 4412 (class 0 OID 25217)
-- Dependencies: 284
-- Data for Name: gallery_items; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.gallery_items (id, project_id, gallery_folder_id, subdivision_code, scene_id, media_type, source_provider, title, source_url, poster_url, sort_order, is_active, metadata, created_at) FROM stdin;
148	1	103	\N	\N	image	external	Mặt bằng tổng thể Hai Van Bay	img/TBM/TMB-OVERVIEW-VHLV/30032026-MB TONG HAI VAN BAY - PREVIEW-02.jpg	img/TBM/_thumbs/30032026-MB TONG HAI VAN BAY -_853cec018c.jpg	0	t	{"thumb": "img/TBM/_thumbs/30032026-MB TONG HAI VAN BAY -_853cec018c.jpg"}	2026-05-22 04:38:53.903655+00
149	1	104	pk-bach-van	\N	image	external	Mặt bằng Bạch Vân	img/TBM/PK BẠCH VÂN/TMB BẠCH VÂN.jpg	img/TBM/_thumbs/TMB BẠCH VÂN_563994d411.jpg	1	t	{"thumb": "img/TBM/_thumbs/TMB BẠCH VÂN_563994d411.jpg"}	2026-05-22 04:38:53.903655+00
150	1	104	pk-bach-van	\N	image	external	Mặt bằng chi tiết Bạch Vân	img/TBM/PK BẠCH VÂN/2403-FULL-BACH VAN .jpg	img/TBM/_thumbs/2403-FULL-BACH VAN _943059a63b.jpg	2	t	{"thumb": "img/TBM/_thumbs/2403-FULL-BACH VAN _943059a63b.jpg"}	2026-05-22 04:38:53.903655+00
151	1	104	pk-bach-van	\N	image	external	Phối cảnh Bạch Vân	img/TBM/PK BẠCH VÂN/bACHvAN.jpg	img/TBM/_thumbs/bACHvAN_9419a115f6.jpg	3	t	{"thumb": "img/TBM/_thumbs/bACHvAN_9419a115f6.jpg"}	2026-05-22 04:38:53.903655+00
152	1	104	pk-bach-van	\N	image	external	Mặt bằng Làng Vân	img/TBM/PK BẠCH VÂN/TMB LÀNG VÂN.jpg	img/TBM/_thumbs/TMB LÀNG VÂN_d9ced65047.jpg	4	t	{"thumb": "img/TBM/_thumbs/TMB LÀNG VÂN_d9ced65047.jpg"}	2026-05-22 04:38:53.903655+00
153	1	104	pk-bach-van	\N	image	external	Tiện ích khu Bạch Vân	img/TBM/PK BẠCH VÂN/TMB-ALLIN-TIENTICH- BACH VAN-01.jpg	img/TBM/_thumbs/TMB-ALLIN-TIENTICH- BACH VAN-0_ae693a7fc1.jpg	5	t	{"thumb": "img/TBM/_thumbs/TMB-ALLIN-TIENTICH- BACH VAN-0_ae693a7fc1.jpg"}	2026-05-22 04:38:53.903655+00
154	1	105	pk-dao-ngoc	\N	image	external	Mặt bằng Đảo Ngọc	img/TBM/PK ĐẢO NGỌC/CUT-TMB-DAONGOC-VHLV.jpg	img/TBM/_thumbs/CUT-TMB-DAONGOC-VHLV_3c984368ee.jpg	6	t	{"thumb": "img/TBM/_thumbs/CUT-TMB-DAONGOC-VHLV_3c984368ee.jpg"}	2026-05-22 04:38:53.903655+00
155	1	106	pk-tinh-van	\N	image	external	Mặt bằng Tinh Vân	img/TBM/PK TINH VÂN/CUT-TMB-TINHVAN-VHLV.JPG	img/TBM/_thumbs/CUT-TMB-TINHVAN-VHLV_4514f3afca.jpg	7	t	{"thumb": "img/TBM/_thumbs/CUT-TMB-TINHVAN-VHLV_4514f3afca.jpg"}	2026-05-22 04:38:53.903655+00
156	1	107	pk-vinh-may	\N	image	external	Mặt bằng Vịnh Mây	img/TBM/PK VỊNH MÂY/CUT-TMB-VINHMAY-VHLV.jpg	img/TBM/_thumbs/CUT-TMB-VINHMAY-VHLV_448f467bee.jpg	8	t	{"thumb": "img/TBM/_thumbs/CUT-TMB-VINHMAY-VHLV_448f467bee.jpg"}	2026-05-22 04:38:53.903655+00
157	1	108	\N	\N	video	drive	TVC tổng dự án	https://drive.google.com/drive/folders/1OGSwVrNAKoWzFNx2OtEI0MZcJiJPtFVq	\N	9	t	{"thumb": null}	2026-05-22 04:38:53.903655+00
158	1	109	\N	\N	video	drive	Phim mood tổng dự án	https://drive.google.com/drive/folders/1ZzEyImCqOdHKn5yp6HzWIkTD9HezvdgY	\N	10	t	{"thumb": null}	2026-05-22 04:38:53.903655+00
159	1	109	\N	\N	video	drive	Phim mood Bạch Vân	https://drive.google.com/drive/folders/1FbkyzaHQLMXSgN5HpC8RXSwBRztGUOdK	\N	11	t	{"thumb": null}	2026-05-22 04:38:53.903655+00
160	1	110	\N	\N	video	drive	Phim FTZ phân tích giá trị	https://drive.google.com/drive/folders/1jn66TIYpF3M1XBA6QjMXCD-qlMXcWfNF	\N	12	t	{"thumb": null}	2026-05-22 04:38:53.903655+00
161	1	111	\N	\N	video	drive	Phim vị trí & thị trường	https://drive.google.com/drive/folders/1Ku3ryWPXYxvcWNXsIs2j0PPRYycNnS46	\N	13	t	{"thumb": null}	2026-05-22 04:38:53.903655+00
162	1	112	\N	\N	video	drive	Chuỗi clip thị trường	https://drive.google.com/drive/folders/10z8i_JEHAzmvdSBWJ5iJVGKiOEtdnzdD	\N	14	t	{"thumb": null}	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4418 (class 0 OID 25284)
-- Dependencies: 290
-- Data for Name: key_visual_groups; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.key_visual_groups (id, project_id, code, name, sort_order) FROM stdin;
37	1	rumor	rumor	0
38	1	launch	launch	1
39	1	render	render	2
40	1	maps	maps	3
\.


--
-- TOC entry 4420 (class 0 OID 25298)
-- Dependencies: 292
-- Data for Name: key_visual_items; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.key_visual_items (id, key_visual_group_id, title, resource_type, provider, resource_url, preview_url, sort_order, is_active, metadata) FROM stdin;
55	37	KV rumor dự án	folder	external	https://drive.google.com/drive/folders/1GHkdq2bnEB8KlPJux9vyhHvX9PcFOdpP	\N	0	t	\N
56	38	KV ra mắt dự án	folder	external	https://drive.google.com/drive/folders/1yfbjeEV5-ybPjxVz6km0m4Mdf5orzkfy	\N	0	t	\N
57	39	Ảnh phối cảnh dự án	folder	external	https://drive.google.com/drive/folders/1_4An_DjojZkiBQBvJxA0Tmq_0ARzjqX6	\N	0	t	\N
58	40	Bản đồ vị trí dự án	folder	external	https://drive.google.com/drive/folders/1CbbpR3pLqmekAKYQhxOLUaDIpAfVlrEJ	\N	0	t	\N
59	40	Bản đồ tiện ích dự án	file	external	https://drive.google.com/file/d/1sNKDKuIL0VBEiuV5gZf-1I6Fnx-5iJ7F/view	\N	1	t	\N
60	40	Bản đồ hạ tầng	file	external	https://drive.google.com/file/d/1huWsNlxNCt4QNrP8g7-q9VFAhDpldKqB/view	\N	2	t	\N
\.


--
-- TOC entry 4367 (class 0 OID 24783)
-- Dependencies: 239
-- Data for Name: languages; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.languages (id, code, name, is_default, is_active) FROM stdin;
1	vi	Vietnamese	t	t
2	en	English	f	t
3	zh	Chinese	f	t
4	ko	Korean	f	t
5	ja	Japanese	f	t
\.


--
-- TOC entry 4491 (class 0 OID 26076)
-- Dependencies: 363
-- Data for Name: lead_assignment_counters; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.lead_assignment_counters (project_id, last_user_id, updated_at) FROM stdin;
1	1	2026-05-22 07:19:06.444835+00
\.


--
-- TOC entry 4474 (class 0 OID 25782)
-- Dependencies: 346
-- Data for Name: lead_assignments; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.lead_assignments (id, lead_id, user_id, assigned_by_user_id, assigned_at, unassigned_at) FROM stdin;
\.


--
-- TOC entry 4470 (class 0 OID 25748)
-- Dependencies: 342
-- Data for Name: lead_consents; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.lead_consents (id, lead_id, channel_code, granted, granted_at) FROM stdin;
\.


--
-- TOC entry 4464 (class 0 OID 25658)
-- Dependencies: 336
-- Data for Name: lead_sources; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.lead_sources (id, project_id, source_group, source_code, source_name, is_paid, is_active, sort_order) FROM stdin;
1	1	social	zalo_oa	Zalo OA	t	t	0
5	1	other	vr_web	VR Web	f	t	0
\.


--
-- TOC entry 4472 (class 0 OID 25763)
-- Dependencies: 344
-- Data for Name: lead_status_history; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.lead_status_history (id, lead_id, old_status_code, new_status_code, changed_by_user_id, note, changed_at) FROM stdin;
\.


--
-- TOC entry 4468 (class 0 OID 25696)
-- Dependencies: 340
-- Data for Name: leads; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.leads (id, project_id, customer_id, source_id, assigned_user_id, sales_public_link_id, interested_property_id, interested_property_type_id, source_label_raw, budget_label, budget_min_vnd, budget_max_vnd, purchase_purpose, purchase_timing, customer_note, crm_note, status_code, pipeline_stage, created_from, is_manual, first_contact_at, last_contact_at, closed_at, created_at, updated_at) FROM stdin;
1	1	1	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 03:22:47.51+00	2026-05-22 03:37:47.261563+00
2	1	2	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 01:27:47.512+00	2026-05-22 03:37:47.261563+00
3	1	3	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-21 22:17:47.512+00	2026-05-22 03:37:47.261563+00
4	1	5	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 03:24:29.297+00	2026-05-22 03:39:29.052956+00
5	1	6	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 01:29:29.299+00	2026-05-22 03:39:29.052956+00
6	1	7	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-21 22:19:29.299+00	2026-05-22 03:39:29.052956+00
7	1	9	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 04:20:23.432+00	2026-05-22 04:35:23.209415+00
8	1	10	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 02:25:23.434+00	2026-05-22 04:35:23.209415+00
9	1	11	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-21 23:15:23.434+00	2026-05-22 04:35:23.209415+00
10	1	13	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 04:23:54.277+00	2026-05-22 04:38:53.903655+00
11	1	14	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-22 02:28:54.28+00	2026-05-22 04:38:53.903655+00
12	1	15	1	1	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	new	lead	web_form	f	\N	\N	\N	2026-05-21 23:18:54.281+00	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4428 (class 0 OID 25362)
-- Dependencies: 300
-- Data for Name: legal_documents; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.legal_documents (id, project_id, subdivision_code, document_name, document_number, detail_text, file_url, issued_on, is_completed, sort_order) FROM stdin;
139	1	\N	Giấy phép xây dựng	\N	Số 1842/GP-UBND — 12/2023	\N	\N	t	0
140	1	\N	Quyết định giao đất	\N	QĐ 3671/QĐ-UBND — 08/2022	\N	\N	t	1
141	1	\N	Thẩm định PCCC	\N	Cục PCCC & CHỮA CHÁY — Q1/2024	\N	\N	t	2
142	1	\N	Bảo lãnh ngân hàng	\N	Vietcombank, BIDV, Techcombank	\N	\N	t	3
143	1	\N	Phê duyệt 1/500	\N	Quyết định UBND Hà Nội — 06/2022	\N	\N	t	4
144	1	\N	Sổ hồng dự kiến	\N	Q2/2028 sau bàn giao	\N	\N	f	5
145	1	pk-bach-van	Giấy phép xây dựng	\N	Số 1842/GP-UBND — 12/2023	\N	\N	t	0
146	1	pk-bach-van	Quyết định giao đất	\N	QĐ 3671/QĐ-UBND — 08/2022	\N	\N	t	1
147	1	pk-bach-van	Thẩm định PCCC	\N	Cục PCCC & CHỮA CHÁY — Q1/2024	\N	\N	t	2
148	1	pk-vinh-may	Giấy phép xây dựng	\N	Số 1842/GP-UBND — 12/2023	\N	\N	t	0
149	1	pk-vinh-may	Quyết định giao đất	\N	QĐ 3671/QĐ-UBND — 08/2022	\N	\N	t	1
150	1	pk-vinh-may	Thẩm định PCCC	\N	Cục PCCC & CHỮA CHÁY — Q1/2024	\N	\N	t	2
151	1	pk-vinh-may	Bảo lãnh ngân hàng	\N	Vietcombank, BIDV, Techcombank	\N	\N	t	3
152	1	pk-dao-ngoc	Giấy phép xây dựng	\N	Số 1842/GP-UBND — 12/2023	\N	\N	t	0
153	1	pk-dao-ngoc	Quyết định giao đất	\N	QĐ 3671/QĐ-UBND — 08/2022	\N	\N	t	1
154	1	pk-dao-ngoc	Thẩm định PCCC	\N	Cục PCCC & CHỮA CHÁY — Q1/2024	\N	\N	t	2
155	1	pk-dao-ngoc	Bảo lãnh ngân hàng	\N	Vietcombank, BIDV, Techcombank	\N	\N	t	3
156	1	pk-dao-ngoc	Phê duyệt 1/500	\N	Quyết định UBND Hà Nội — 06/2022	\N	\N	t	4
157	1	pk-tinh-van	Giấy phép xây dựng	\N	Số 1842/GP-UBND — 12/2023	\N	\N	t	0
158	1	pk-tinh-van	Quyết định giao đất	\N	QĐ 3671/QĐ-UBND — 08/2022	\N	\N	t	1
159	1	pk-tinh-van	Thẩm định PCCC	\N	Cục PCCC & CHỮA CHÁY — Q1/2024	\N	\N	t	2
\.


--
-- TOC entry 4402 (class 0 OID 25135)
-- Dependencies: 274
-- Data for Name: masterplan_categories; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.masterplan_categories (id, masterplan_id, code, label, icon_code, sort_order) FROM stdin;
55	10	all	Tất cả	grid	0
56	10	phankhu	Phân khu	map	1
57	10	bds	Bất động sản	home	2
58	10	tienich	Tiện ích	leaf	3
59	10	hatang	Hạ tầng	road	4
60	10	phuchop	Khu phức hợp	transit	5
\.


--
-- TOC entry 4406 (class 0 OID 25173)
-- Dependencies: 278
-- Data for Name: masterplan_filter_groups; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.masterplan_filter_groups (id, masterplan_id, code, label, sort_order) FROM stdin;
37	10	phanKhu	phanKhu	0
38	10	loaiHienThi	loaiHienThi	1
39	10	batDongSan	batDongSan	2
40	10	trangThai	trangThai	3
\.


--
-- TOC entry 4408 (class 0 OID 25187)
-- Dependencies: 280
-- Data for Name: masterplan_filter_options; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.masterplan_filter_options (id, filter_group_id, option_code, label, color_hex, sort_order) FROM stdin;
163	37	pk-bach-van	Bạch Vân	\N	0
164	37	pk-vinh-may	Vịnh Mây	\N	1
165	37	pk-dao-ngoc	Đảo Ngọc	\N	2
166	37	pk-tinh-van	Tịnh Vân	\N	3
167	38	tienich	Tiện ích	#f4c97d	0
168	38	phuchop	Khu phức hợp	#a78bfa	1
169	38	hatang	Hạ tầng	#60a5fa	2
170	38	congvien	Công viên cây xanh	#34d399	3
171	38	cangbien	Cảng biển	#38bdf8	4
172	38	marina	Bến du thuyền	#22d3ee	5
173	39	biet-thu	Biệt thự	\N	0
174	39	can-ho	Căn hộ	\N	1
175	39	shophouse	Shophouse	\N	2
176	39	dat-nen	Đất nền	\N	3
177	39	nha-pho	Nhà phố	\N	4
178	40	da-hien	Đã hiện	#34d399	0
179	40	trien-khai	Đang triển khai	#f4c97d	1
180	40	quy-hoach	Quy hoạch	#94a3b8	2
\.


--
-- TOC entry 4404 (class 0 OID 25149)
-- Dependencies: 276
-- Data for Name: masterplan_markers; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.masterplan_markers (id, masterplan_id, marker_code, category_code, label, description, x_pct, y_pct, menu_item_id, sort_order, is_active) FROM stdin;
83	10	m-bach-van	phankhu	Bạch Vân	Phân khu logistics & cảng biển	26.00	42.00	\N	0	t
84	10	m-vinh-may	phankhu	Vịnh Mây	Phân khu nghỉ dưỡng ven biển	58.00	34.00	\N	1	t
85	10	m-dao-ngoc	phankhu	Đảo Ngọc	Compound đảo khép kín	72.00	58.00	\N	2	t
86	10	m-tinh-van	phankhu	Tịnh Vân	Đô thị thương mại	44.00	66.00	\N	3	t
87	10	m-cang	hatang	Cảng Liên Chiểu	Cảng biển nước sâu	14.00	30.00	\N	4	t
88	10	m-lrt	hatang	Ga LRT trung tâm	Đường sắt đô thị	40.00	50.00	\N	5	t
89	10	m-tttm	phuchop	TTTM Hai Van Bay	Tổ hợp thương mại	50.00	60.00	\N	6	t
90	10	m-cv	tienich	Công viên trung tâm	Công viên sinh thái 12ha	52.00	46.00	\N	7	t
91	10	m-marina	tienich	Bến du thuyền	Marina quốc tế	66.00	44.00	\N	8	t
\.


--
-- TOC entry 4400 (class 0 OID 25114)
-- Dependencies: 272
-- Data for Name: masterplans; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.masterplans (id, project_id, image_url, intro_text, updated_by_user_id, updated_at) FROM stdin;
10	1	img/masterplan/masterplane.png	Tổng quan quy hoạch khu đô thị Vinhomes Hai Van Bay — 4 phân khu chức năng kết nối đồng bộ hạ tầng, cảng biển và tiện ích.	\N	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4382 (class 0 OID 24946)
-- Dependencies: 254
-- Data for Name: menu_groups; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_groups (id, project_id, parent_menu_item_id, code, display_name, short_code, icon_code, sort_order, is_system, is_active) FROM stdin;
183	1	\N	tongQuan	Tổng quan	\N	\N	0	f	t
184	1	\N	phanKhu	Phân khu	\N	\N	1	f	t
185	1	395	tienIchNoiKhu	Tiện ích nội khu	\N	\N	0	f	t
186	1	395	tienIchNgoaiKhu	Tiện ích ngoại khu	\N	\N	1	f	t
187	1	395	matBangTang	Mặt bằng tầng	\N	\N	2	f	t
188	1	395	view360Can	View 360 căn	\N	\N	3	f	t
189	1	406	tienIchNoiKhu	Tiện ích nội khu	\N	\N	0	f	t
190	1	406	tienIchNgoaiKhu	Tiện ích ngoại khu	\N	\N	1	f	t
191	1	406	matBangTang	Mặt bằng tầng	\N	\N	2	f	t
192	1	406	view360Can	View 360 căn	\N	\N	3	f	t
193	1	416	tienIchNoiKhu	Tiện ích nội khu	\N	\N	0	f	t
194	1	416	tienIchNgoaiKhu	Tiện ích ngoại khu	\N	\N	1	f	t
195	1	416	matBangTang	Mặt bằng tầng	\N	\N	2	f	t
196	1	416	view360Can	View 360 căn	\N	\N	3	f	t
197	1	424	tienIchNoiKhu	Tiện ích nội khu	\N	\N	0	f	t
198	1	424	tienIchNgoaiKhu	Tiện ích ngoại khu	\N	\N	1	f	t
199	1	424	matBangTang	Mặt bằng tầng	\N	\N	2	f	t
200	1	424	view360Can	View 360 căn	\N	\N	3	f	t
\.


--
-- TOC entry 4387 (class 0 OID 25006)
-- Dependencies: 259
-- Data for Name: menu_item_detail_images; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_item_detail_images (id, menu_item_id, image_url, sort_order) FROM stdin;
55	396	img/1.png	0
56	396	img/2.png	1
57	397	img/1.png	0
58	397	img/2.png	1
59	398	img/1.png	0
60	398	img/2.png	1
61	399	img/2.png	0
62	399	img/1.png	1
63	400	img/2.png	0
64	400	img/1.png	1
65	401	img/1.png	0
66	401	img/2.png	1
67	402	img/1.png	0
68	402	img/2.png	1
69	403	img/2.png	0
70	403	img/1.png	1
71	404	img/2.png	0
72	404	img/1.png	1
73	405	img/2.png	0
74	405	img/1.png	1
75	407	img/1.png	0
76	407	img/2.png	1
77	408	img/1.png	0
78	408	img/2.png	1
79	409	img/2.png	0
80	409	img/1.png	1
81	410	img/2.png	0
82	410	img/1.png	1
83	411	img/2.png	0
84	411	img/1.png	1
85	412	img/1.png	0
86	412	img/2.png	1
87	413	img/2.png	0
88	413	img/1.png	1
89	414	img/2.png	0
90	414	img/1.png	1
91	415	img/2.png	0
92	415	img/1.png	1
93	417	img/1.png	0
94	417	img/2.png	1
95	418	img/1.png	0
96	418	img/2.png	1
97	419	img/2.png	0
98	419	img/1.png	1
99	420	img/1.png	0
100	420	img/2.png	1
101	421	img/2.png	0
102	421	img/1.png	1
103	422	img/2.png	0
104	422	img/1.png	1
105	423	img/2.png	0
106	423	img/1.png	1
107	425	img/1.png	0
108	425	img/2.png	1
109	426	img/2.png	0
110	426	img/1.png	1
111	427	img/2.png	0
112	427	img/1.png	1
113	428	img/1.png	0
114	428	img/2.png	1
115	429	img/2.png	0
116	429	img/1.png	1
117	430	img/2.png	0
118	430	img/1.png	1
\.


--
-- TOC entry 4389 (class 0 OID 25020)
-- Dependencies: 261
-- Data for Name: menu_item_detail_specs; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_item_detail_specs (id, menu_item_id, label, value_text, sort_order) FROM stdin;
109	396	Diện tích mặt nước	850 m²	0
110	396	Độ sâu	0.6 – 1.6 m	1
111	396	Vị trí	Tầng 5 khối đế	2
112	396	Giờ mở cửa	06:00 – 22:00	3
113	397	Loại hình	Tiện ích nội khu	0
114	397	Đối tượng	Cư dân phân khu	1
115	397	Giờ hoạt động	06:00 – 22:00	2
116	397	Tình trạng	Đang vận hành	3
117	398	Chiều dài tuyến	23 km	0
118	398	Số ga	18 ga	1
119	398	Ga gần nhất	450 m	2
120	398	Dự kiến vận hành	2027	3
121	399	Loại hình	Tiện ích ngoại khu	0
122	399	Khoảng cách	0.5 – 2 km	1
123	399	Di chuyển	3 – 8 phút	2
124	399	Tình trạng	Hiện hữu	3
125	400	Loại hình	Tiện ích ngoại khu	0
126	400	Khoảng cách	0.5 – 2 km	1
127	400	Di chuyển	3 – 8 phút	2
128	400	Tình trạng	Hiện hữu	3
129	401	Số tầng	42 tầng	0
130	401	Căn/sàn	8 – 12 căn	1
131	401	Thang máy	6 thang tốc độ cao	2
132	401	Bàn giao	Quý IV / 2027	3
133	402	Số tầng	42 tầng	0
134	402	Căn/sàn	8 – 12 căn	1
135	402	Thang máy	6 thang tốc độ cao	2
136	402	Bàn giao	Quý IV / 2027	3
137	403	Diện tích	34m²	0
138	403	Ban công	Có	1
139	403	Hướng	Đông Nam	2
140	403	Nội thất	Bàn giao cơ bản	3
141	404	Diện tích	54.6m²	0
142	404	Ban công	Có	1
143	404	Hướng	Đông Nam	2
144	404	Nội thất	Bàn giao cơ bản	3
145	405	Diện tích	62.2m²	0
146	405	Ban công	Có	1
147	405	Hướng	Đông Nam	2
148	405	Nội thất	Bàn giao cơ bản	3
149	407	Loại hình	Tiện ích nội khu	0
150	407	Đối tượng	Cư dân phân khu	1
151	407	Giờ hoạt động	06:00 – 22:00	2
152	407	Tình trạng	Đang vận hành	3
153	408	Loại hình	Tiện ích nội khu	0
154	408	Đối tượng	Cư dân phân khu	1
155	408	Giờ hoạt động	06:00 – 22:00	2
156	408	Tình trạng	Đang vận hành	3
157	409	Loại hình	Tiện ích ngoại khu	0
158	409	Khoảng cách	0.5 – 2 km	1
159	409	Di chuyển	3 – 8 phút	2
160	409	Tình trạng	Hiện hữu	3
161	410	Loại hình	Tiện ích ngoại khu	0
162	410	Khoảng cách	0.5 – 2 km	1
163	410	Di chuyển	3 – 8 phút	2
164	410	Tình trạng	Hiện hữu	3
165	411	Loại hình	Tiện ích ngoại khu	0
166	411	Khoảng cách	0.5 – 2 km	1
167	411	Di chuyển	3 – 8 phút	2
168	411	Tình trạng	Hiện hữu	3
169	412	Số tầng	42 tầng	0
170	412	Căn/sàn	8 – 12 căn	1
171	412	Thang máy	6 thang tốc độ cao	2
172	412	Bàn giao	Quý IV / 2027	3
173	413	Diện tích	35.1m²	0
174	413	Ban công	Có	1
175	413	Hướng	Đông Nam	2
176	413	Nội thất	Bàn giao cơ bản	3
177	414	Diện tích	54.7m²	0
178	414	Ban công	Có	1
179	414	Hướng	Đông Nam	2
180	414	Nội thất	Bàn giao cơ bản	3
181	415	Diện tích	74.5m²	0
182	415	Ban công	Có	1
183	415	Hướng	Đông Nam	2
184	415	Nội thất	Bàn giao cơ bản	3
185	417	Loại hình	Tiện ích nội khu	0
186	417	Đối tượng	Cư dân phân khu	1
187	417	Giờ hoạt động	06:00 – 22:00	2
188	417	Tình trạng	Đang vận hành	3
189	418	Quy mô	12 ha	0
190	418	Số giường bệnh	600 giường	1
191	418	Khoảng cách	1.2 km	2
192	418	Tiêu chuẩn	JCI Quốc tế	3
193	419	Loại hình	Tiện ích ngoại khu	0
194	419	Khoảng cách	0.5 – 2 km	1
195	419	Di chuyển	3 – 8 phút	2
196	419	Tình trạng	Hiện hữu	3
197	420	Số tầng	42 tầng	0
198	420	Căn/sàn	8 – 12 căn	1
199	420	Thang máy	6 thang tốc độ cao	2
200	420	Bàn giao	Quý IV / 2027	3
201	421	Diện tích	43m²	0
202	421	Ban công	Có	1
203	421	Hướng	Đông Nam	2
204	421	Nội thất	Bàn giao cơ bản	3
205	422	Diện tích	59.2m²	0
206	422	Ban công	Có	1
207	422	Hướng	Đông Nam	2
208	422	Nội thất	Bàn giao cơ bản	3
209	423	Diện tích	75.6m²	0
210	423	Ban công	Có	1
211	423	Hướng	Đông Nam	2
212	423	Nội thất	Bàn giao cơ bản	3
213	425	Loại hình	Tiện ích nội khu	0
214	425	Đối tượng	Cư dân phân khu	1
215	425	Giờ hoạt động	06:00 – 22:00	2
216	425	Tình trạng	Đang vận hành	3
217	426	Loại hình	Tiện ích ngoại khu	0
218	426	Khoảng cách	0.5 – 2 km	1
219	426	Di chuyển	3 – 8 phút	2
220	426	Tình trạng	Hiện hữu	3
221	427	Loại hình	Tiện ích ngoại khu	0
222	427	Khoảng cách	0.5 – 2 km	1
223	427	Di chuyển	3 – 8 phút	2
224	427	Tình trạng	Hiện hữu	3
225	428	Số tầng	42 tầng	0
226	428	Căn/sàn	8 – 12 căn	1
227	428	Thang máy	6 thang tốc độ cao	2
228	428	Bàn giao	Quý IV / 2027	3
229	429	Diện tích	46.4m²	0
230	429	Ban công	Có	1
231	429	Hướng	Đông Nam	2
232	429	Nội thất	Bàn giao cơ bản	3
233	430	Diện tích	62.2m²	0
234	430	Ban công	Có	1
235	430	Hướng	Đông Nam	2
236	430	Nội thất	Bàn giao cơ bản	3
\.


--
-- TOC entry 4385 (class 0 OID 24993)
-- Dependencies: 257
-- Data for Name: menu_item_details; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_item_details (menu_item_id, title, subtitle, category, description) FROM stdin;
396	Bể bơi vô cực	Thư giãn	Tiện ích nội khu	Bể bơi vô cực tầm nhìn panorama hướng vịnh, thiết kế tràn bờ tinh tế, khu vực bể riêng cho trẻ em và hệ thống lọc nước thông minh.
397	Sky Lounge	Tiện ích	Tiện ích nội khu	Sky Lounge — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.
398	Tuyến Metro số 6	Kết nối	Hạ tầng giao thông	Tuyến đường sắt đô thị kết nối trực tiếp khu đô thị với trung tâm thành phố và sân bay, rút ngắn thời gian di chuyển, gia tăng giá trị bất động sản khu vực.
399	Đại lộ Thăng Long	Kết nối	Hạ tầng & tiện ích ngoại khu	Đại lộ Thăng Long — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
400	Đường Lê Trọng Tấn	Kết nối	Hạ tầng & tiện ích ngoại khu	Đường Lê Trọng Tấn — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
401	Tòa Thảo Mộc (I5)	Toà căn hộ	Mặt bằng tòa	Tòa Thảo Mộc (I5) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.
402	Tòa The Lake Premium (I1)	Toà căn hộ	Mặt bằng tòa	Tòa The Lake Premium (I1) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.
403	Studio - 34m²	Căn mẫu	View 360° căn hộ	Studio - 34m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
404	2 phòng ngủ + 1 - 54.6m²	Căn mẫu	View 360° căn hộ	2 phòng ngủ + 1 - 54.6m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
405	2 phòng ngủ + 1 - 62.2m²	Căn mẫu	View 360° căn hộ	2 phòng ngủ + 1 - 62.2m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
407	Đường dạo bộ	Tiện ích	Tiện ích nội khu	Đường dạo bộ — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.
408	Spa & Onsen	Tiện ích	Tiện ích nội khu	Spa & Onsen — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.
409	Tuyến đường Ánh Sáng	Kết nối	Hạ tầng & tiện ích ngoại khu	Tuyến đường Ánh Sáng — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
410	Vincom Mega Mall	Kết nối	Hạ tầng & tiện ích ngoại khu	Vincom Mega Mall — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
411	Trường THCS Nguyễn Quý Đức	Kết nối	Hạ tầng & tiện ích ngoại khu	Trường THCS Nguyễn Quý Đức — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
412	Tòa Nguyệt Quế (I4)	Toà căn hộ	Mặt bằng tòa	Tòa Nguyệt Quế (I4) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.
413	Studio - 35.1m²	Căn mẫu	View 360° căn hộ	Studio - 35.1m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
414	2 phòng ngủ + 1 - 54.7m²	Căn mẫu	View 360° căn hộ	2 phòng ngủ + 1 - 54.7m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
415	3 phòng ngủ - 74.5m²	Căn mẫu	View 360° căn hộ	3 phòng ngủ - 74.5m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
417	Sân chơi trẻ em	Tiện ích	Tiện ích nội khu	Sân chơi trẻ em — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.
418	Bệnh viện Quốc tế Vinmec	Bệnh viện	Hạ tầng trọng điểm	Bệnh viện đa khoa quốc tế tiêu chuẩn 5 sao, trang thiết bị hiện đại, đội ngũ chuyên gia đầu ngành, phục vụ chăm sóc sức khỏe toàn diện cho cư dân khu đô thị.
419	TTTM & nhà để xe 10 tầng	Kết nối	Hạ tầng & tiện ích ngoại khu	TTTM & nhà để xe 10 tầng — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
420	Tòa The Central (I3)	Toà căn hộ	Mặt bằng tòa	Tòa The Central (I3) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.
421	1 phòng ngủ + 1 - 43m²	Căn mẫu	View 360° căn hộ	1 phòng ngủ + 1 - 43m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
422	2 phòng ngủ + 1 - 59.2m²	Căn mẫu	View 360° căn hộ	2 phòng ngủ + 1 - 59.2m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
423	3 phòng ngủ - 75.6m²	Căn mẫu	View 360° căn hộ	3 phòng ngủ - 75.6m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
425	Sân thể thao	Tiện ích	Tiện ích nội khu	Sân thể thao — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.
426	Zen Park	Kết nối	Hạ tầng & tiện ích ngoại khu	Zen Park — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
427	Central Park 10.2ha	Kết nối	Hạ tầng & tiện ích ngoại khu	Central Park 10.2ha — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.
428	Tòa The Park (I2)	Toà căn hộ	Mặt bằng tòa	Tòa The Park (I2) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.
429	2 phòng ngủ + 1 - 46.4m²	Căn mẫu	View 360° căn hộ	2 phòng ngủ + 1 - 46.4m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
430	2 phòng ngủ + 1 - 62.2m²	Căn mẫu	View 360° căn hộ	2 phòng ngủ + 1 - 62.2m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.
\.


--
-- TOC entry 4392 (class 0 OID 25044)
-- Dependencies: 264
-- Data for Name: menu_item_subdivision_facts; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_item_subdivision_facts (id, menu_item_id, label, value_text, sort_order) FROM stdin;
145	395	Quy mô	~ 320 ha	0
146	395	Định hướng	Logistics & cảng biển quốc tế	1
147	395	Lô trí kết nối	210 ha	2
148	395	Định hướng phát triển	Logistics & Công nghiệp	3
149	406	Quy mô	~ 260 ha	0
150	406	Định hướng	Nghỉ dưỡng ven biển	1
151	406	Mật độ xây dựng	22%	2
152	406	Loại hình chủ đạo	Biệt thự & Shophouse	3
153	416	Quy mô	~ 95 ha	0
154	416	Định hướng	Compound đảo khép kín	1
155	416	Mật độ xây dựng	18%	2
156	416	Loại hình chủ đạo	Biệt thự đảo	3
157	424	Quy mô	~ 180 ha	0
158	424	Định hướng	Đô thị thương mại	1
159	424	Mật độ xây dựng	35%	2
160	424	Loại hình chủ đạo	Shophouse & Căn hộ	3
\.


--
-- TOC entry 4394 (class 0 OID 25056)
-- Dependencies: 266
-- Data for Name: menu_item_subdivision_points; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_item_subdivision_points (id, menu_item_id, point_text, sort_order) FROM stdin;
163	395	Trung tâm logistics quốc tế cấp vùng	0
164	395	Cảng Liên Chiểu – cửa ngõ hàng hải chiến lược	1
165	395	Khu công nghiệp Hải Vân Bay	2
166	395	Depot & LRT – Trung tâm vận tải đa phương thức	3
167	395	Tuyến LRT kết nối nội khu & Đà Nẵng	4
168	395	Liên kết trực tiếp cao tốc La Sơn – Túy Loan	5
169	406	Đường bờ vịnh riêng dài 2.4 km	0
170	406	Bến du thuyền quốc tế	1
171	406	Hệ tiện ích resort 5 sao	2
172	406	Công viên ven biển sinh thái	3
173	416	Compound khép kín an ninh 3 lớp	0
174	416	Cầu cảnh quan kết nối đất liền	1
175	416	Clubhouse & bến du thuyền nội khu	2
176	416	Công viên trung tâm đảo	3
177	424	Trục phố thương mại trung tâm	0
178	424	Quảng trường lễ hội	1
179	424	Tổ hợp TTTM & giải trí	2
180	424	Kết nối trực tiếp tuyến LRT	3
\.


--
-- TOC entry 4390 (class 0 OID 25031)
-- Dependencies: 262
-- Data for Name: menu_item_subdivisions; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_item_subdivisions (menu_item_id, name, description, cover_url, video_url) FROM stdin;
395	Phân khu Bạch Vân	Bạch Vân là trung tâm logistics và cảng biển chiến lược của khu đô thị, kết nối trực tiếp Cảng Liên Chiểu, đường sắt LRT và hệ thống cao tốc liên vùng – Tây và cao tốc Bắc – Nam, định hướng phát triển kinh tế biển và thương mại.	img/2.png	\N
406	Phân khu Vịnh Mây	Vịnh Mây là phân khu nghỉ dưỡng cao cấp ven biển, sở hữu đường bờ vịnh riêng, hệ tiện ích resort và mật độ xây dựng thấp, mang đến không gian sống xanh đẳng cấp.	img/2.png	\N
416	Phân khu Đảo Ngọc	Đảo Ngọc là phân khu compound khép kín trên đảo, kết nối bằng cầu cảnh quan, định vị cộng đồng cư dân tinh hoa với an ninh và riêng tư tuyệt đối.	img/2.png	\N
424	Phân khu Tịnh Vân	Tịnh Vân là phân khu đô thị thương mại sầm uất, tập trung shophouse và căn hộ thương mại, là trung tâm mua sắm – dịch vụ của toàn khu đô thị.	img/2.png	\N
\.


--
-- TOC entry 4384 (class 0 OID 24962)
-- Dependencies: 256
-- Data for Name: menu_items; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.menu_items (id, menu_group_id, panorama_id, scene_id, item_code, label, description, external_url, hotspot_code, sort_order, is_active) FROM stdin;
389	183	\N	\N	aerial	Tổng quan (Top View)	\N	\N	pano-01	0	t
390	183	\N	\N	view-1	Tổng quan (View 1)	\N	\N	pano-22	1	t
391	183	\N	\N	view-2	Tổng quan (View 2)	\N	\N	pano-37	2	t
392	183	\N	\N	view-3	Tổng quan (View 3)	\N	\N	pano-41	3	t
393	183	\N	\N	view-4	Tổng quan (View 4)	\N	\N	pano-44	4	t
394	183	\N	\N	view-5	Tổng quan (View 5)	\N	\N	pano-02	5	t
395	184	\N	\N	pk-bach-van	Phân khu Bạch Vân	\N	\N	pano-29	0	t
396	185	\N	\N	be-boi	Bể bơi	\N	\N	pano-13	0	t
397	185	\N	\N	sky-lounge-tn	Sky Lounge	\N	\N	pano-31	1	t
398	186	\N	\N	metro-6	Tuyến Metro 6	\N	\N	pano-38	0	t
399	186	\N	\N	dl-thang-long	Đại lộ Thăng Long	\N	\N	pano-06	1	t
400	186	\N	\N	le-trong-tan	Đường Lê Trọng Tấn	\N	\N	pano-12	2	t
401	187	\N	\N	i5	Tòa Thảo Mộc (I5)	\N	\N	pano-03	0	t
402	187	\N	\N	i1	Tòa The Lake Premium (I1)	\N	\N	pano-33	1	t
403	188	\N	\N	studio-34	Studio - 34m²	\N	\N	pano-16	0	t
404	188	\N	\N	2pn1-54a	2 phòng ngủ + 1 - 54.6m²	\N	\N	pano-20	1	t
405	188	\N	\N	2pn1-62b	2 phòng ngủ + 1 - 62.2m²	\N	\N	pano-26	2	t
406	184	\N	\N	pk-vinh-may	Phân khu Vịnh Mây	\N	\N	pano-30	1	t
407	189	\N	\N	duong-dao-bo	Đường dạo bộ	\N	\N	pano-08	0	t
408	189	\N	\N	spa-onsen	Spa & Onsen	\N	\N	pano-35	1	t
409	190	\N	\N	duong-as	Tuyến đường Ánh Sáng	\N	\N	pano-42	0	t
410	190	\N	\N	vincom-mega	Vincom Mega Mall	\N	\N	pano-07	1	t
411	190	\N	\N	thcs-nqd	Trường THCS Nguyễn Quý Đức	\N	\N	pano-39	2	t
412	191	\N	\N	i4	Tòa Nguyệt Quế (I4)	\N	\N	pano-04	0	t
413	192	\N	\N	studio-35	Studio - 35.1m²	\N	\N	pano-17	0	t
414	192	\N	\N	2pn1-54b	2 phòng ngủ + 1 - 54.7m²	\N	\N	pano-23	1	t
415	192	\N	\N	3pn-74	3 phòng ngủ - 74.5m²	\N	\N	pano-27	2	t
416	184	\N	\N	pk-dao-ngoc	Phân khu Đảo Ngọc	\N	\N	pano-32	2	t
417	193	\N	\N	san-choi-tre	Sân chơi trẻ em	\N	\N	pano-09	0	t
418	194	\N	\N	vinmec	Bệnh viện Quốc tế Vinmec	\N	\N	pano-43	0	t
419	194	\N	\N	tttm-10	TTTM & nhà để xe 10 tầng	\N	\N	pano-10	1	t
420	195	\N	\N	i3	Tòa The Central (I3)	\N	\N	pano-14	0	t
421	196	\N	\N	1pn1-43	1 phòng ngủ + 1 - 43m²	\N	\N	pano-18	0	t
422	196	\N	\N	2pn1-59	2 phòng ngủ + 1 - 59.2m²	\N	\N	pano-24	1	t
423	196	\N	\N	3pn-75	3 phòng ngủ - 75.6m²	\N	\N	pano-28	2	t
424	184	\N	\N	pk-tinh-van	Phân khu Tịnh Vân	\N	\N	pano-34	3	t
425	197	\N	\N	san-the-thao	Sân thể thao	\N	\N	pano-15	0	t
426	198	\N	\N	zen-park	Zen Park	\N	\N	pano-05	0	t
427	198	\N	\N	central-park	Central Park 10.2ha	\N	\N	pano-11	1	t
428	199	\N	\N	i2	Tòa The Park (I2)	\N	\N	pano-21	0	t
429	200	\N	\N	2pn1-46	2 phòng ngủ + 1 - 46.4m²	\N	\N	pano-19	0	t
430	200	\N	\N	2pn1-62a	2 phòng ngủ + 1 - 62.2m²	\N	\N	pano-25	1	t
\.


--
-- TOC entry 4434 (class 0 OID 25407)
-- Dependencies: 306
-- Data for Name: nearby_places; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.nearby_places (id, project_location_id, category_code, name, distance_km, distance_text, travel_minutes, travel_time_text, sort_order, is_active) FROM stdin;
139	32	school	Trường THCS Nguyễn Quý Đức	0.40	0.4 km	5	5 phút	0	t
140	32	school	Trường Liên cấp song ngữ Aurora	0.10	0.1 km	2	2 phút	1	t
141	32	hospital	BV Quốc tế Vinmec	1.20	1.2 km	8	8 phút	2	t
142	32	hospital	BV Bạch Mai	3.50	3.5 km	15	15 phút	3	t
143	32	metro	Ga Metro Tây Hồ Tây	0.60	0.6 km	7	7 phút	4	t
144	32	metro	Ga Metro Cầu Giấy	2.10	2.1 km	10	10 phút	5	t
145	32	mall	Vincom Mega Mall	0.80	0.8 km	5	5 phút	6	t
146	32	mall	AEON Mall Hà Đông	4.20	4.2 km	18	18 phút	7	t
147	32	airport	Sân bay Nội Bài	28.00	28 km	35	35 phút	8	t
148	33	school	Trường THCS Nguyễn Quý Đức	0.40	0.4 km	5	5 phút	0	t
149	33	metro	Ga Metro Tây Hồ Tây	0.60	0.6 km	7	7 phút	1	t
150	33	airport	Sân bay Nội Bài	28.00	28 km	35	35 phút	2	t
151	34	school	Trường Liên cấp song ngữ Aurora	0.10	0.1 km	2	2 phút	0	t
152	34	metro	Ga Metro Cầu Giấy	2.10	2.1 km	10	10 phút	1	t
153	35	hospital	BV Quốc tế Vinmec	1.20	1.2 km	8	8 phút	0	t
154	35	mall	Vincom Mega Mall	0.80	0.8 km	5	5 phút	1	t
155	36	hospital	BV Bạch Mai	3.50	3.5 km	15	15 phút	0	t
156	36	mall	AEON Mall Hà Đông	4.20	4.2 km	18	18 phút	1	t
\.


--
-- TOC entry 4376 (class 0 OID 24878)
-- Dependencies: 248
-- Data for Name: panorama_assets; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.panorama_assets (id, project_id, panorama_code, source_hex_key, title, thumbnail_url, media_url, sort_order, is_active, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 4363 (class 0 OID 24758)
-- Dependencies: 235
-- Data for Name: project_card_highlights; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_card_highlights (id, project_id, icon_code, label, value_text, sort_order) FROM stdin;
46	1	area	Diện tích phát triển	1.200 ha	0
47	1	port	Cảng biển nước sâu	Liên Chiểu	1
48	1	transit	Kết nối LRT	Tuyến Liên Chiểu – Đà Nẵng	2
49	1	road	Cao tốc liên vùng	Đà Nẵng – Huế	3
50	1	leaf	Định hướng phát triển	Logistics xanh & bền vững	4
\.


--
-- TOC entry 4361 (class 0 OID 24739)
-- Dependencies: 233
-- Data for Name: project_card_overviews; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_card_overviews (project_id, description, updated_by_user_id, updated_at) FROM stdin;
1	Trung tâm logistics và cảng biển hiện đại, kết nối trực tiếp Cảng Liên Chiểu, đường sắt LRT và hệ thống cao tốc liên vùng, thúc đẩy giao thương quốc tế và chuỗi cung ứng toàn cầu.	\N	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4365 (class 0 OID 24770)
-- Dependencies: 237
-- Data for Name: project_card_quick_links; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_card_quick_links (id, project_id, action_code, icon_code, label, sort_order) FROM stdin;
37	1	open-masterplan	map	Xem Masterplan tổng thể	0
38	1	open-phankhu	grid	Khám phá 4 phân khu	1
39	1	open-properties	home	Danh sách sản phẩm	2
40	1	open-modal	doc	Nhận tư vấn dự án	3
\.


--
-- TOC entry 4432 (class 0 OID 25392)
-- Dependencies: 304
-- Data for Name: project_locations; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_locations (id, project_id, subdivision_code, latitude, longitude, map_embed_url, address_text) FROM stdin;
32	1	\N	16.2130000	108.1200000	https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed	\N
33	1	pk-bach-van	16.2130000	108.1200000	https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed	\N
34	1	pk-vinh-may	16.2130000	108.1200000	https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed	\N
35	1	pk-dao-ngoc	16.2130000	108.1200000	https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed	\N
36	1	pk-tinh-van	16.2130000	108.1200000	https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed	\N
\.


--
-- TOC entry 4357 (class 0 OID 24670)
-- Dependencies: 229
-- Data for Name: project_memberships; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_memberships (id, project_id, user_id, role_id, public_slug, is_primary_sales, is_active, created_at) FROM stdin;
21	1	21	5	\N	f	t	2026-05-22 07:08:30.363589+00
22	1	22	1	\N	f	t	2026-05-22 07:08:30.363589+00
2	1	2	3	sales2	t	t	2026-05-22 03:37:47.261563+00
1	1	1	3	sales	t	t	2026-05-22 03:37:47.261563+00
\.


--
-- TOC entry 4416 (class 0 OID 25260)
-- Dependencies: 288
-- Data for Name: project_resources; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_resources (id, project_id, resource_category_id, subdivision_code, resource_key, title, resource_type, provider, resource_url, sort_order, is_active, metadata) FROM stdin;
156	1	\N	\N	brochure	Tờ rơi dự án	folder	external	https://drive.google.com/drive/folders/1m_KyuIsFgP6RLIclH-GJSE82rC9wEy32	0	t	\N
157	1	\N	\N	salesKit	Bộ bí kíp tư vấn (nội bộ)	folder	external	https://drive.google.com/drive/folders/1mY4CqH8I0FWKMCyx1nFYeQNdhhKL39Xi	1	t	\N
158	1	\N	\N	brandKit	Bộ nhận diện thương hiệu	folder	external	https://drive.google.com/drive/folders/1NeXfCqSULl6mNqQn4YW-BtLi1M8ZmArf	2	t	\N
159	1	\N	\N	priceList	Bảng giá & chính sách bán hàng	pdf	external		3	t	\N
160	1	\N	\N	floorPlanPdf	TMB mã căn & diện tích	folder	external	https://drive.google.com/drive/folders/1H5CPAaedDai9qLku8m9p98VKcRitHL09	4	t	\N
161	1	\N	pk-bach-van	brochure	Tờ rơi dự án	folder	external		0	t	\N
162	1	\N	pk-bach-van	salesKit	Bộ bí kíp tư vấn (nội bộ)	folder	external		1	t	\N
163	1	\N	pk-bach-van	brandKit	Bộ nhận diện thương hiệu	folder	external		2	t	\N
164	1	\N	pk-bach-van	priceList	Bảng giá & chính sách bán hàng	pdf	external		3	t	\N
165	1	\N	pk-bach-van	floorPlanPdf	TMB mã căn & diện tích	folder	external		4	t	\N
166	1	\N	pk-vinh-may	brochure	Tờ rơi dự án	folder	external		0	t	\N
167	1	\N	pk-vinh-may	salesKit	Bộ bí kíp tư vấn (nội bộ)	folder	external		1	t	\N
168	1	\N	pk-vinh-may	brandKit	Bộ nhận diện thương hiệu	folder	external		2	t	\N
169	1	\N	pk-vinh-may	priceList	Bảng giá & chính sách bán hàng	pdf	external		3	t	\N
170	1	\N	pk-vinh-may	floorPlanPdf	TMB mã căn & diện tích	folder	external		4	t	\N
171	1	\N	pk-dao-ngoc	brochure	Tờ rơi dự án	folder	external		0	t	\N
172	1	\N	pk-dao-ngoc	salesKit	Bộ bí kíp tư vấn (nội bộ)	folder	external		1	t	\N
173	1	\N	pk-dao-ngoc	brandKit	Bộ nhận diện thương hiệu	folder	external		2	t	\N
174	1	\N	pk-dao-ngoc	priceList	Bảng giá & chính sách bán hàng	pdf	external		3	t	\N
175	1	\N	pk-dao-ngoc	floorPlanPdf	TMB mã căn & diện tích	folder	external		4	t	\N
176	1	\N	pk-tinh-van	brochure	Tờ rơi dự án	folder	external		0	t	\N
177	1	\N	pk-tinh-van	salesKit	Bộ bí kíp tư vấn (nội bộ)	folder	external		1	t	\N
178	1	\N	pk-tinh-van	brandKit	Bộ nhận diện thương hiệu	folder	external		2	t	\N
179	1	\N	pk-tinh-van	priceList	Bảng giá & chính sách bán hàng	pdf	external		3	t	\N
180	1	\N	pk-tinh-van	floorPlanPdf	TMB mã căn & diện tích	folder	external		4	t	\N
\.


--
-- TOC entry 4360 (class 0 OID 24719)
-- Dependencies: 232
-- Data for Name: project_settings; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_settings (project_id, publish_mode, ai_ws_url, crm_api_key_enc, google_maps_api_key_enc, backup_policy_json, feature_flags_json, updated_by_user_id, updated_at) FROM stdin;
1	manual_export	\N	\N	\N	\N	{"siteMap": {"zoom": 14, "center": [16.213, 108.12]}}	\N	2026-05-22 03:37:47.261563+00
\.


--
-- TOC entry 4422 (class 0 OID 25315)
-- Dependencies: 294
-- Data for Name: project_statistics; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_statistics (id, project_id, subdivision_code, label, unit_label, value_text, numeric_value, sort_order) FROM stdin;
161	1	\N	Cây xanh nội khu	ha	12.4	12.4000	0
162	1	\N	Mật độ xây dựng	%	27	27.0000	1
163	1	\N	Tới hồ Tây	phút	8	8.0000	2
164	1	\N	Tầm view panorama	tầng	42	42.0000	3
165	1	\N	Kinh nghiệm	năm	18	18.0000	100
166	1	\N	Đã bàn giao	căn	12.400	12.4000	101
167	1	\N	Tỉnh thành	dự án	24	24.0000	102
168	1	\N	Cư dân	+	38.000	38.0000	103
169	1	pk-bach-van	Kinh nghiệm	năm	18	18.0000	100
170	1	pk-bach-van	Đã bàn giao	căn	12.400	12.4000	101
171	1	pk-bach-van	Tỉnh thành	dự án	24	24.0000	102
172	1	pk-bach-van	Cư dân	+	38.000	38.0000	103
173	1	pk-vinh-may	Kinh nghiệm	năm	18	18.0000	100
174	1	pk-vinh-may	Đã bàn giao	căn	12.400	12.4000	101
175	1	pk-vinh-may	Tỉnh thành	dự án	24	24.0000	102
176	1	pk-vinh-may	Cư dân	+	38.000	38.0000	103
177	1	pk-dao-ngoc	Kinh nghiệm	năm	18	18.0000	100
178	1	pk-dao-ngoc	Đã bàn giao	căn	12.400	12.4000	101
179	1	pk-dao-ngoc	Tỉnh thành	dự án	24	24.0000	102
180	1	pk-dao-ngoc	Cư dân	+	38.000	38.0000	103
181	1	pk-tinh-van	Kinh nghiệm	năm	18	18.0000	100
182	1	pk-tinh-van	Đã bàn giao	căn	12.400	12.4000	101
183	1	pk-tinh-van	Tỉnh thành	dự án	24	24.0000	102
184	1	pk-tinh-van	Cư dân	+	38.000	38.0000	103
\.


--
-- TOC entry 4430 (class 0 OID 25377)
-- Dependencies: 302
-- Data for Name: project_testimonials; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_testimonials (id, project_id, subdivision_code, initials, customer_role, unit_label, testimonial_text, avatar_url, sort_order, is_active) FROM stdin;
52	1	\N	N.T.H	Chuyên gia tài chính	Duplex 3PN tầng 40	Môi trường sống đẳng cấp, view hồ Tây tuyệt đẹp. Quyết định mua là đúng đắn nhất năm ngoái.	\N	0	t
53	1	\N	P.M.Q	Doanh nhân	2PN+1 tầng 22	Tiến độ xây dựng đúng cam kết, đội ngũ tư vấn chuyên nghiệp. Rất hài lòng với chất lượng hoàn thiện.	\N	1	t
54	1	\N	L.T.A	Bác sĩ	3PN tầng 35	Tiện ích nội khu vượt kỳ vọng. Bể bơi và công viên là điểm nhấn tuyệt vời cho gia đình.	\N	2	t
55	1	pk-bach-van	N.T.H	Chuyên gia tài chính	Duplex 3PN tầng 40	Môi trường sống đẳng cấp, view hồ Tây tuyệt đẹp. Quyết định mua là đúng đắn nhất năm ngoái.	\N	0	t
56	1	pk-vinh-may	P.M.Q	Doanh nhân	2PN+1 tầng 22	Tiến độ xây dựng đúng cam kết, đội ngũ tư vấn chuyên nghiệp. Rất hài lòng với chất lượng hoàn thiện.	\N	0	t
57	1	pk-dao-ngoc	L.T.A	Bác sĩ	3PN tầng 35	Tiện ích nội khu vượt kỳ vọng. Bể bơi và công viên là điểm nhấn tuyệt vời cho gia đình.	\N	0	t
58	1	pk-tinh-van	N.T.H	Chuyên gia tài chính	Duplex 3PN tầng 40	Môi trường sống đẳng cấp, view hồ Tây tuyệt đẹp. Quyết định mua là đúng đắn nhất năm ngoái.	\N	0	t
\.


--
-- TOC entry 4374 (class 0 OID 24854)
-- Dependencies: 246
-- Data for Name: project_themes; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_themes (project_id, active_theme_preset_id, custom_tokens_json, effects_json, updated_by_user_id, updated_at) FROM stdin;
\.


--
-- TOC entry 4371 (class 0 OID 24803)
-- Dependencies: 243
-- Data for Name: project_translations; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_translations (id, project_id, language_id, translation_key_id, translated_text, updated_by_user_id, updated_at) FROM stdin;
1821	1	1	1	Đang khởi tạo không gian 360°	\N	2026-05-22 04:50:40.503898+00
1822	1	2	1	Initializing 360° space	\N	2026-05-22 04:50:40.503898+00
1823	1	3	1	正在初始化 360° 空间	\N	2026-05-22 04:50:40.503898+00
1824	1	4	1	360° 공간 초기화 중	\N	2026-05-22 04:50:40.503898+00
1825	1	5	1	360° 空間を初期化中	\N	2026-05-22 04:50:40.503898+00
1826	1	1	2	Bản đồ 2D	\N	2026-05-22 04:50:40.503898+00
1827	1	2	2	2D Map	\N	2026-05-22 04:50:40.503898+00
1828	1	3	2	2D 地图	\N	2026-05-22 04:50:40.503898+00
1829	1	4	2	2D 지도	\N	2026-05-22 04:50:40.503898+00
1830	1	5	2	2Dマップ	\N	2026-05-22 04:50:40.503898+00
1831	1	1	3	Bản đồ 2D	\N	2026-05-22 04:50:40.503898+00
1832	1	2	3	2D Map	\N	2026-05-22 04:50:40.503898+00
1833	1	3	3	2D 地图	\N	2026-05-22 04:50:40.503898+00
1834	1	4	3	2D 지도	\N	2026-05-22 04:50:40.503898+00
1835	1	5	3	2Dマップ	\N	2026-05-22 04:50:40.503898+00
1836	1	1	4	Thư viện	\N	2026-05-22 04:50:40.503898+00
1837	1	2	4	Gallery	\N	2026-05-22 04:50:40.503898+00
1838	1	3	4	图库	\N	2026-05-22 04:50:40.503898+00
1839	1	4	4	갤러리	\N	2026-05-22 04:50:40.503898+00
1840	1	5	4	ギャラリー	\N	2026-05-22 04:50:40.503898+00
1841	1	1	5	Thư viện ảnh	\N	2026-05-22 04:50:40.503898+00
1842	1	2	5	Photo gallery	\N	2026-05-22 04:50:40.503898+00
1843	1	3	5	图片库	\N	2026-05-22 04:50:40.503898+00
1844	1	4	5	사진 갤러리	\N	2026-05-22 04:50:40.503898+00
1845	1	5	5	フォトギャラリー	\N	2026-05-22 04:50:40.503898+00
1846	1	1	6	Đặt lịch	\N	2026-05-22 04:50:40.503898+00
1847	1	2	6	Book a visit	\N	2026-05-22 04:50:40.503898+00
1848	1	3	6	预约参观	\N	2026-05-22 04:50:40.503898+00
1849	1	4	6	방문 예약	\N	2026-05-22 04:50:40.503898+00
1850	1	5	6	見学予約	\N	2026-05-22 04:50:40.503898+00
1851	1	1	7	Giá từ	\N	2026-05-22 04:50:40.503898+00
1852	1	2	7	From	\N	2026-05-22 04:50:40.503898+00
1853	1	3	7	起价	\N	2026-05-22 04:50:40.503898+00
1854	1	4	7	시작가	\N	2026-05-22 04:50:40.503898+00
1855	1	5	7	価格	\N	2026-05-22 04:50:40.503898+00
1856	1	1	8	Xem bảng giá & ưu đãi	\N	2026-05-22 04:50:40.503898+00
1857	1	2	8	View pricing & offers	\N	2026-05-22 04:50:40.503898+00
1858	1	3	8	查看价格及优惠	\N	2026-05-22 04:50:40.503898+00
1859	1	4	8	가격표 & 혜택 보기	\N	2026-05-22 04:50:40.503898+00
1860	1	5	8	価格表と特典を見る	\N	2026-05-22 04:50:40.503898+00
1861	1	1	9	Tải brochure PDF	\N	2026-05-22 04:50:40.503898+00
1862	1	2	9	Download PDF brochure	\N	2026-05-22 04:50:40.503898+00
1863	1	3	9	下载 PDF 手册	\N	2026-05-22 04:50:40.503898+00
1864	1	4	9	PDF 브로슈어 다운로드	\N	2026-05-22 04:50:40.503898+00
1865	1	5	9	PDFパンフレットをダウンロード	\N	2026-05-22 04:50:40.503898+00
1866	1	1	10	Kéo để xoay · Cuộn để zoom	\N	2026-05-22 04:50:40.503898+00
1867	1	2	10	Drag to rotate · Scroll to zoom	\N	2026-05-22 04:50:40.503898+00
1868	1	3	10	拖动旋转 · 滚动缩放	\N	2026-05-22 04:50:40.503898+00
1869	1	4	10	드래그하여 회전 · 스크롤하여 확대	\N	2026-05-22 04:50:40.503898+00
1870	1	5	10	ドラッグで回転 · スクロールでズーム	\N	2026-05-22 04:50:40.503898+00
1871	1	1	11	Tìm kiếm…	\N	2026-05-22 04:50:40.503898+00
1872	1	2	11	Search…	\N	2026-05-22 04:50:40.503898+00
1873	1	3	11	搜索…	\N	2026-05-22 04:50:40.503898+00
1874	1	4	11	검색…	\N	2026-05-22 04:50:40.503898+00
1875	1	5	11	検索…	\N	2026-05-22 04:50:40.503898+00
1876	1	1	12	Thu gọn	\N	2026-05-22 04:50:40.503898+00
1877	1	2	12	Collapse	\N	2026-05-22 04:50:40.503898+00
1878	1	3	12	收起	\N	2026-05-22 04:50:40.503898+00
1879	1	4	12	접기	\N	2026-05-22 04:50:40.503898+00
1880	1	5	12	折りたたむ	\N	2026-05-22 04:50:40.503898+00
1881	1	1	13	Mở rộng thông tin dự án	\N	2026-05-22 04:50:40.503898+00
1882	1	2	13	Expand project info	\N	2026-05-22 04:50:40.503898+00
1883	1	3	13	展开项目信息	\N	2026-05-22 04:50:40.503898+00
1884	1	4	13	프로젝트 정보 펼치기	\N	2026-05-22 04:50:40.503898+00
1885	1	5	13	プロジェクト情報を展開	\N	2026-05-22 04:50:40.503898+00
1886	1	1	14	Mở bảng điều hướng	\N	2026-05-22 04:50:40.503898+00
1887	1	2	14	Open navigation panel	\N	2026-05-22 04:50:40.503898+00
1888	1	3	14	打开导航面板	\N	2026-05-22 04:50:40.503898+00
1889	1	4	14	내비게이션 패널 열기	\N	2026-05-22 04:50:40.503898+00
1890	1	5	14	ナビゲーションパネルを開く	\N	2026-05-22 04:50:40.503898+00
1891	1	1	15	Hiện giao diện	\N	2026-05-22 04:50:40.503898+00
1892	1	2	15	Show interface	\N	2026-05-22 04:50:40.503898+00
1893	1	3	15	显示界面	\N	2026-05-22 04:50:40.503898+00
1894	1	4	15	인터페이스 표시	\N	2026-05-22 04:50:40.503898+00
1895	1	5	15	UIを表示	\N	2026-05-22 04:50:40.503898+00
1896	1	1	16	Chat với trợ lý AI	\N	2026-05-22 04:50:40.503898+00
1897	1	2	16	Chat with AI assistant	\N	2026-05-22 04:50:40.503898+00
1898	1	3	16	与 AI 助理对话	\N	2026-05-22 04:50:40.503898+00
1899	1	4	16	AI 어시스턴트와 채팅	\N	2026-05-22 04:50:40.503898+00
1900	1	5	16	AIアシスタントとチャット	\N	2026-05-22 04:50:40.503898+00
1901	1	1	17	Bỏ qua	\N	2026-05-22 04:50:40.503898+00
1902	1	2	17	Skip	\N	2026-05-22 04:50:40.503898+00
1903	1	3	17	跳过	\N	2026-05-22 04:50:40.503898+00
1904	1	4	17	건너뛰기	\N	2026-05-22 04:50:40.503898+00
1905	1	5	17	スキップ	\N	2026-05-22 04:50:40.503898+00
1906	1	1	18	Click bất kỳ đâu để tiếp tục →	\N	2026-05-22 04:50:40.503898+00
1907	1	2	18	Click anywhere to continue →	\N	2026-05-22 04:50:40.503898+00
1908	1	3	18	点击任意位置继续 →	\N	2026-05-22 04:50:40.503898+00
1909	1	4	18	아무 곳이나 클릭하여 계속 →	\N	2026-05-22 04:50:40.503898+00
1910	1	5	18	どこかをクリックして続行 →	\N	2026-05-22 04:50:40.503898+00
1911	1	1	19	Bước {n} / {total}	\N	2026-05-22 04:50:40.503898+00
1912	1	2	19	Step {n} / {total}	\N	2026-05-22 04:50:40.503898+00
1913	1	3	19	第 {n} / {total} 步	\N	2026-05-22 04:50:40.503898+00
1914	1	4	19	{n} / {total} 단계	\N	2026-05-22 04:50:40.503898+00
1915	1	5	19	ステップ {n} / {total}	\N	2026-05-22 04:50:40.503898+00
1916	1	1	20	Xem 360°	\N	2026-05-22 04:50:40.503898+00
1917	1	2	20	View in 360°	\N	2026-05-22 04:50:40.503898+00
1918	1	3	20	查看 360°	\N	2026-05-22 04:50:40.503898+00
1919	1	4	20	360° 보기	\N	2026-05-22 04:50:40.503898+00
1920	1	5	20	360°で見る	\N	2026-05-22 04:50:40.503898+00
1921	1	1	21	Tiện ích lân cận	\N	2026-05-22 04:50:40.503898+00
1922	1	2	21	Nearby amenity	\N	2026-05-22 04:50:40.503898+00
1923	1	3	21	周边配套	\N	2026-05-22 04:50:40.503898+00
1924	1	4	21	주변 시설	\N	2026-05-22 04:50:40.503898+00
1925	1	5	21	周辺施設	\N	2026-05-22 04:50:40.503898+00
1926	1	1	22	Không tìm thấy mục phù hợp	\N	2026-05-22 04:50:40.503898+00
1927	1	2	22	No matching items	\N	2026-05-22 04:50:40.503898+00
1928	1	3	22	未找到匹配项	\N	2026-05-22 04:50:40.503898+00
1929	1	4	22	일치하는 항목이 없습니다	\N	2026-05-22 04:50:40.503898+00
1930	1	5	22	該当する項目はありません	\N	2026-05-22 04:50:40.503898+00
1931	1	1	23	căn	\N	2026-05-22 04:50:40.503898+00
1932	1	2	23	units	\N	2026-05-22 04:50:40.503898+00
1933	1	3	23	套	\N	2026-05-22 04:50:40.503898+00
1934	1	4	23	세대	\N	2026-05-22 04:50:40.503898+00
1935	1	5	23	戸	\N	2026-05-22 04:50:40.503898+00
1936	1	1	24	Tự xoay	\N	2026-05-22 04:50:40.503898+00
1937	1	2	24	Auto-rotate	\N	2026-05-22 04:50:40.503898+00
1938	1	3	24	自动旋转	\N	2026-05-22 04:50:40.503898+00
1939	1	4	24	자동 회전	\N	2026-05-22 04:50:40.503898+00
1940	1	5	24	自動回転	\N	2026-05-22 04:50:40.503898+00
1941	1	1	25	Phóng to	\N	2026-05-22 04:50:40.503898+00
1942	1	2	25	Zoom in	\N	2026-05-22 04:50:40.503898+00
1943	1	3	25	放大	\N	2026-05-22 04:50:40.503898+00
1944	1	4	25	확대	\N	2026-05-22 04:50:40.503898+00
1945	1	5	25	拡大	\N	2026-05-22 04:50:40.503898+00
1946	1	1	26	Thu nhỏ	\N	2026-05-22 04:50:40.503898+00
1947	1	2	26	Zoom out	\N	2026-05-22 04:50:40.503898+00
1948	1	3	26	缩小	\N	2026-05-22 04:50:40.503898+00
1949	1	4	26	축소	\N	2026-05-22 04:50:40.503898+00
1950	1	5	26	縮小	\N	2026-05-22 04:50:40.503898+00
1951	1	1	27	Toàn màn hình	\N	2026-05-22 04:50:40.503898+00
1952	1	2	27	Fullscreen	\N	2026-05-22 04:50:40.503898+00
1953	1	3	27	全屏	\N	2026-05-22 04:50:40.503898+00
1954	1	4	27	전체 화면	\N	2026-05-22 04:50:40.503898+00
1955	1	5	27	フルスクリーン	\N	2026-05-22 04:50:40.503898+00
1956	1	1	28	Hướng dẫn sử dụng	\N	2026-05-22 04:50:40.503898+00
1957	1	2	28	User guide	\N	2026-05-22 04:50:40.503898+00
1958	1	3	28	使用指南	\N	2026-05-22 04:50:40.503898+00
1959	1	4	28	사용 안내	\N	2026-05-22 04:50:40.503898+00
1960	1	5	28	使い方ガイド	\N	2026-05-22 04:50:40.503898+00
1961	1	1	29	Ngôn ngữ	\N	2026-05-22 04:50:40.503898+00
1962	1	2	29	Language	\N	2026-05-22 04:50:40.503898+00
1963	1	3	29	语言	\N	2026-05-22 04:50:40.503898+00
1964	1	4	29	언어	\N	2026-05-22 04:50:40.503898+00
1965	1	5	29	言語	\N	2026-05-22 04:50:40.503898+00
1966	1	1	30	BẢNG GIÁ & CĂN HỘ CÒN TRỐNG	\N	2026-05-22 04:50:40.503898+00
1967	1	2	30	PRICING & AVAILABLE UNITS	\N	2026-05-22 04:50:40.503898+00
1968	1	3	30	价格及在售单元	\N	2026-05-22 04:50:40.503898+00
1969	1	4	30	가격 & 분양 가능 세대	\N	2026-05-22 04:50:40.503898+00
1970	1	5	30	価格と販売中の住戸	\N	2026-05-22 04:50:40.503898+00
1971	1	1	31	Tháp A — Mở bán giai đoạn 2	\N	2026-05-22 04:50:40.503898+00
1972	1	2	31	Tower A — Phase 2 launch	\N	2026-05-22 04:50:40.503898+00
1973	1	3	31	A 塔 — 第二期开盘	\N	2026-05-22 04:50:40.503898+00
1974	1	4	31	A 동 — 2단계 분양	\N	2026-05-22 04:50:40.503898+00
1975	1	5	31	Aタワー — 第2期販売	\N	2026-05-22 04:50:40.503898+00
1976	1	1	32	Quỹ căn hiện hữu cập nhật theo thời gian thực. Ưu đãi giai đoạn 2: chiết khấu 8% cho thanh toán sớm, cam kết thuê lại 7%/năm trong 24 tháng đầu tiên.	\N	2026-05-22 04:50:40.503898+00
1977	1	2	32	Available inventory updated in real time. Phase 2 offers: 8% early-payment discount and 7%/year guaranteed leaseback for the first 24 months.	\N	2026-05-22 04:50:40.503898+00
2069	1	4	50	상담 요청 보내기	\N	2026-05-22 04:50:40.503898+00
1978	1	3	32	现有房源实时更新。第二期优惠:提前付款 8% 折扣,前 24 个月保证 7%/年回租收益。	\N	2026-05-22 04:50:40.503898+00
1979	1	4	32	실시간으로 업데이트되는 재고. 2단계 혜택: 조기 납부 8% 할인, 첫 24개월 동안 7%/년 임대 보장.	\N	2026-05-22 04:50:40.503898+00
1980	1	5	32	在庫はリアルタイムで更新されます。第2期特典:早期支払い8%割引、最初の24か月間7%/年の家賃保証。	\N	2026-05-22 04:50:40.503898+00
1981	1	1	33	Mã căn	\N	2026-05-22 04:50:40.503898+00
1982	1	2	33	Code	\N	2026-05-22 04:50:40.503898+00
1983	1	3	33	编号	\N	2026-05-22 04:50:40.503898+00
1984	1	4	33	코드	\N	2026-05-22 04:50:40.503898+00
1985	1	5	33	コード	\N	2026-05-22 04:50:40.503898+00
1986	1	1	34	Loại	\N	2026-05-22 04:50:40.503898+00
1987	1	2	34	Type	\N	2026-05-22 04:50:40.503898+00
1988	1	3	34	户型	\N	2026-05-22 04:50:40.503898+00
1989	1	4	34	유형	\N	2026-05-22 04:50:40.503898+00
1990	1	5	34	タイプ	\N	2026-05-22 04:50:40.503898+00
1991	1	1	35	Diện tích	\N	2026-05-22 04:50:40.503898+00
1992	1	2	35	Area	\N	2026-05-22 04:50:40.503898+00
1993	1	3	35	面积	\N	2026-05-22 04:50:40.503898+00
1994	1	4	35	면적	\N	2026-05-22 04:50:40.503898+00
1995	1	5	35	面積	\N	2026-05-22 04:50:40.503898+00
1996	1	1	36	Giá từ	\N	2026-05-22 04:50:40.503898+00
1997	1	2	36	From	\N	2026-05-22 04:50:40.503898+00
1998	1	3	36	起价	\N	2026-05-22 04:50:40.503898+00
1999	1	4	36	시작가	\N	2026-05-22 04:50:40.503898+00
2000	1	5	36	価格	\N	2026-05-22 04:50:40.503898+00
2001	1	1	37	Còn lại	\N	2026-05-22 04:50:40.503898+00
2002	1	2	37	Available	\N	2026-05-22 04:50:40.503898+00
2003	1	3	37	剩余	\N	2026-05-22 04:50:40.503898+00
2004	1	4	37	잔여	\N	2026-05-22 04:50:40.503898+00
2005	1	5	37	残り	\N	2026-05-22 04:50:40.503898+00
2006	1	1	38	Để chúng tôi liên hệ lại	\N	2026-05-22 04:50:40.503898+00
2007	1	2	38	Have us call you back	\N	2026-05-22 04:50:40.503898+00
2008	1	3	38	请回电给我	\N	2026-05-22 04:50:40.503898+00
2009	1	4	38	전화 상담 요청	\N	2026-05-22 04:50:40.503898+00
2010	1	5	38	折り返しご連絡します	\N	2026-05-22 04:50:40.503898+00
2011	1	1	39	Họ & tên	\N	2026-05-22 04:50:40.503898+00
2012	1	2	39	Full name	\N	2026-05-22 04:50:40.503898+00
2013	1	3	39	姓名	\N	2026-05-22 04:50:40.503898+00
2014	1	4	39	성명	\N	2026-05-22 04:50:40.503898+00
2015	1	5	39	氏名	\N	2026-05-22 04:50:40.503898+00
2016	1	1	40	Nguyễn Văn A	\N	2026-05-22 04:50:40.503898+00
2017	1	2	40	John Doe	\N	2026-05-22 04:50:40.503898+00
2018	1	3	40	张三	\N	2026-05-22 04:50:40.503898+00
2019	1	4	40	홍길동	\N	2026-05-22 04:50:40.503898+00
2020	1	5	40	山田 太郎	\N	2026-05-22 04:50:40.503898+00
2021	1	1	41	Số điện thoại	\N	2026-05-22 04:50:40.503898+00
2022	1	2	41	Phone number	\N	2026-05-22 04:50:40.503898+00
2023	1	3	41	电话	\N	2026-05-22 04:50:40.503898+00
2024	1	4	41	전화번호	\N	2026-05-22 04:50:40.503898+00
2025	1	5	41	電話番号	\N	2026-05-22 04:50:40.503898+00
2026	1	1	42	09xx xxx xxx	\N	2026-05-22 04:50:40.503898+00
2027	1	2	42	09xx xxx xxx	\N	2026-05-22 04:50:40.503898+00
2028	1	3	42	09xx xxx xxx	\N	2026-05-22 04:50:40.503898+00
2029	1	4	42	09xx xxx xxx	\N	2026-05-22 04:50:40.503898+00
2030	1	5	42	09xx xxx xxx	\N	2026-05-22 04:50:40.503898+00
2031	1	1	43	Loại căn quan tâm	\N	2026-05-22 04:50:40.503898+00
2032	1	2	43	Unit type of interest	\N	2026-05-22 04:50:40.503898+00
2033	1	3	43	感兴趣的户型	\N	2026-05-22 04:50:40.503898+00
2034	1	4	43	관심 유형	\N	2026-05-22 04:50:40.503898+00
2035	1	5	43	希望タイプ	\N	2026-05-22 04:50:40.503898+00
2036	1	1	44	2 phòng ngủ	\N	2026-05-22 04:50:40.503898+00
2037	1	2	44	2 bedrooms	\N	2026-05-22 04:50:40.503898+00
2038	1	3	44	两居室	\N	2026-05-22 04:50:40.503898+00
2039	1	4	44	2개 침실	\N	2026-05-22 04:50:40.503898+00
2040	1	5	44	2ベッドルーム	\N	2026-05-22 04:50:40.503898+00
2041	1	1	45	2 phòng ngủ +1	\N	2026-05-22 04:50:40.503898+00
2042	1	2	45	2 bedrooms +1	\N	2026-05-22 04:50:40.503898+00
2043	1	3	45	两居室 +1	\N	2026-05-22 04:50:40.503898+00
2044	1	4	45	2개 침실 +1	\N	2026-05-22 04:50:40.503898+00
2045	1	5	45	2ベッドルーム +1	\N	2026-05-22 04:50:40.503898+00
2046	1	1	46	3 phòng ngủ	\N	2026-05-22 04:50:40.503898+00
2047	1	2	46	3 bedrooms	\N	2026-05-22 04:50:40.503898+00
2048	1	3	46	三居室	\N	2026-05-22 04:50:40.503898+00
2049	1	4	46	3개 침실	\N	2026-05-22 04:50:40.503898+00
2050	1	5	46	3ベッドルーム	\N	2026-05-22 04:50:40.503898+00
2051	1	1	47	Duplex / Penthouse	\N	2026-05-22 04:50:40.503898+00
2052	1	2	47	Duplex / Penthouse	\N	2026-05-22 04:50:40.503898+00
2053	1	3	47	复式 / 顶层公寓	\N	2026-05-22 04:50:40.503898+00
2054	1	4	47	복층 / 펜트하우스	\N	2026-05-22 04:50:40.503898+00
2055	1	5	47	デュプレックス / ペントハウス	\N	2026-05-22 04:50:40.503898+00
2056	1	1	48	Ghi chú	\N	2026-05-22 04:50:40.503898+00
2057	1	2	48	Note	\N	2026-05-22 04:50:40.503898+00
2058	1	3	48	备注	\N	2026-05-22 04:50:40.503898+00
2059	1	4	48	메모	\N	2026-05-22 04:50:40.503898+00
2060	1	5	48	備考	\N	2026-05-22 04:50:40.503898+00
2061	1	1	49	Tôi muốn được tư vấn vào cuối tuần…	\N	2026-05-22 04:50:40.503898+00
2062	1	2	49	I'd like a consultation on the weekend…	\N	2026-05-22 04:50:40.503898+00
2063	1	3	49	希望在周末获得咨询…	\N	2026-05-22 04:50:40.503898+00
2064	1	4	49	주말에 상담을 받고 싶습니다…	\N	2026-05-22 04:50:40.503898+00
2065	1	5	49	週末に相談を希望します…	\N	2026-05-22 04:50:40.503898+00
2066	1	1	50	Gửi yêu cầu tư vấn	\N	2026-05-22 04:50:40.503898+00
2067	1	2	50	Submit consultation request	\N	2026-05-22 04:50:40.503898+00
2068	1	3	50	提交咨询请求	\N	2026-05-22 04:50:40.503898+00
2070	1	5	50	相談を申し込む	\N	2026-05-22 04:50:40.503898+00
2071	1	1	51	Tiến độ dự án	\N	2026-05-22 04:50:40.503898+00
2072	1	2	51	Project timeline	\N	2026-05-22 04:50:40.503898+00
2073	1	3	51	项目进度	\N	2026-05-22 04:50:40.503898+00
2074	1	4	51	프로젝트 일정	\N	2026-05-22 04:50:40.503898+00
2075	1	5	51	プロジェクトの進捗	\N	2026-05-22 04:50:40.503898+00
2076	1	1	52	Mặt bằng tổng thể	\N	2026-05-22 04:50:40.503898+00
2077	1	2	52	Master plan	\N	2026-05-22 04:50:40.503898+00
2078	1	3	52	总体规划	\N	2026-05-22 04:50:40.503898+00
2079	1	4	52	마스터 플랜	\N	2026-05-22 04:50:40.503898+00
2080	1	5	52	全体計画	\N	2026-05-22 04:50:40.503898+00
2081	1	1	53	Bản đồ thiết kế 2D	\N	2026-05-22 04:50:40.503898+00
2082	1	2	53	2D design map	\N	2026-05-22 04:50:40.503898+00
2083	1	3	53	2D 设计图	\N	2026-05-22 04:50:40.503898+00
2084	1	4	53	2D 설계 지도	\N	2026-05-22 04:50:40.503898+00
2085	1	5	53	2D設計マップ	\N	2026-05-22 04:50:40.503898+00
2086	1	1	54	Bấm vào các điểm trên bản đồ để vào không gian 360° tương ứng	\N	2026-05-22 04:50:40.503898+00
2087	1	2	54	Click points on the map to enter the corresponding 360° space	\N	2026-05-22 04:50:40.503898+00
2088	1	3	54	点击地图上的点进入相应的 360° 空间	\N	2026-05-22 04:50:40.503898+00
2089	1	4	54	지도의 지점을 클릭하여 해당 360° 공간으로 이동	\N	2026-05-22 04:50:40.503898+00
2090	1	5	54	マップ上のポイントをクリックして対応する360°空間に入ります	\N	2026-05-22 04:50:40.503898+00
2091	1	1	55	Thư viện hình ảnh	\N	2026-05-22 04:50:40.503898+00
2092	1	2	55	Image gallery	\N	2026-05-22 04:50:40.503898+00
2093	1	3	55	图片库	\N	2026-05-22 04:50:40.503898+00
2094	1	4	55	이미지 갤러리	\N	2026-05-22 04:50:40.503898+00
2095	1	5	55	画像ギャラリー	\N	2026-05-22 04:50:40.503898+00
2096	1	1	56	Khám phá Vinhomes Hai Van Bay	\N	2026-05-22 04:50:40.503898+00
2097	1	2	56	Explore Vinhomes Hai Van Bay	\N	2026-05-22 04:50:40.503898+00
2098	1	3	56	探索 Vinhomes Hai Van Bay	\N	2026-05-22 04:50:40.503898+00
2099	1	4	56	Vinhomes Hai Van Bay 둘러보기	\N	2026-05-22 04:50:40.503898+00
2100	1	5	56	Vinhomes Hai Van Bayを探索	\N	2026-05-22 04:50:40.503898+00
2101	1	1	57	Trợ lý Vinhomes Hai Van Bay	\N	2026-05-22 04:50:40.503898+00
2102	1	2	57	Vinhomes Hai Van Bay Assistant	\N	2026-05-22 04:50:40.503898+00
2103	1	3	57	Vinhomes Hai Van Bay 助理	\N	2026-05-22 04:50:40.503898+00
2104	1	4	57	Vinhomes Hai Van Bay 어시스턴트	\N	2026-05-22 04:50:40.503898+00
2105	1	5	57	Vinhomes Hai Van Bay アシスタント	\N	2026-05-22 04:50:40.503898+00
2106	1	1	58	Đang hoạt động	\N	2026-05-22 04:50:40.503898+00
2107	1	2	58	Online	\N	2026-05-22 04:50:40.503898+00
2108	1	3	58	在线	\N	2026-05-22 04:50:40.503898+00
2109	1	4	58	온라인	\N	2026-05-22 04:50:40.503898+00
2110	1	5	58	オンライン	\N	2026-05-22 04:50:40.503898+00
2111	1	1	59	Đang lắng nghe…	\N	2026-05-22 04:50:40.503898+00
2112	1	2	59	Listening…	\N	2026-05-22 04:50:40.503898+00
2113	1	3	59	正在聆听…	\N	2026-05-22 04:50:40.503898+00
2114	1	4	59	듣는 중…	\N	2026-05-22 04:50:40.503898+00
2115	1	5	59	聞いています…	\N	2026-05-22 04:50:40.503898+00
2116	1	1	60	Đang suy nghĩ…	\N	2026-05-22 04:50:40.503898+00
2117	1	2	60	Thinking…	\N	2026-05-22 04:50:40.503898+00
2118	1	3	60	思考中…	\N	2026-05-22 04:50:40.503898+00
2119	1	4	60	생각 중…	\N	2026-05-22 04:50:40.503898+00
2120	1	5	60	考え中…	\N	2026-05-22 04:50:40.503898+00
2121	1	1	61	Đang trả lời…	\N	2026-05-22 04:50:40.503898+00
2122	1	2	61	Replying…	\N	2026-05-22 04:50:40.503898+00
2123	1	3	61	回复中…	\N	2026-05-22 04:50:40.503898+00
2124	1	4	61	응답 중…	\N	2026-05-22 04:50:40.503898+00
2125	1	5	61	応答中…	\N	2026-05-22 04:50:40.503898+00
2126	1	1	62	Nhập câu hỏi…	\N	2026-05-22 04:50:40.503898+00
2127	1	2	62	Type your question…	\N	2026-05-22 04:50:40.503898+00
2128	1	3	62	请输入问题…	\N	2026-05-22 04:50:40.503898+00
2129	1	4	62	질문을 입력하세요…	\N	2026-05-22 04:50:40.503898+00
2130	1	5	62	質問を入力…	\N	2026-05-22 04:50:40.503898+00
2131	1	1	63	Đóng	\N	2026-05-22 04:50:40.503898+00
2132	1	2	63	Close	\N	2026-05-22 04:50:40.503898+00
2133	1	3	63	关闭	\N	2026-05-22 04:50:40.503898+00
2134	1	4	63	닫기	\N	2026-05-22 04:50:40.503898+00
2135	1	5	63	閉じる	\N	2026-05-22 04:50:40.503898+00
2136	1	1	64	Trình duyệt chưa hỗ trợ nhận dạng giọng nói. Vui lòng dùng Chrome hoặc Edge.	\N	2026-05-22 04:50:40.503898+00
2137	1	2	64	Your browser does not support speech recognition. Please use Chrome or Edge.	\N	2026-05-22 04:50:40.503898+00
2138	1	3	64	您的浏览器不支持语音识别。请使用 Chrome 或 Edge。	\N	2026-05-22 04:50:40.503898+00
2139	1	4	64	브라우저가 음성 인식을 지원하지 않습니다. Chrome 또는 Edge를 사용하세요.	\N	2026-05-22 04:50:40.503898+00
2140	1	5	64	ブラウザが音声認識に対応していません。ChromeまたはEdgeをお使いください。	\N	2026-05-22 04:50:40.503898+00
2141	1	1	65	Bạn cần cho phép truy cập micro để dùng tính năng trò chuyện bằng giọng nói.	\N	2026-05-22 04:50:40.503898+00
2142	1	2	65	You need to allow microphone access to use voice chat.	\N	2026-05-22 04:50:40.503898+00
2143	1	3	65	需要允许麦克风权限才能使用语音对话。	\N	2026-05-22 04:50:40.503898+00
2144	1	4	65	음성 채팅을 사용하려면 마이크 권한을 허용해야 합니다.	\N	2026-05-22 04:50:40.503898+00
2145	1	5	65	音声チャットを使うにはマイクの許可が必要です。	\N	2026-05-22 04:50:40.503898+00
2146	1	1	66	Không thể kết nối dịch vụ nhận dạng giọng nói. Vui lòng thử lại sau.	\N	2026-05-22 04:50:40.503898+00
2147	1	2	66	Cannot connect to speech recognition service. Please try again later.	\N	2026-05-22 04:50:40.503898+00
2148	1	3	66	无法连接语音识别服务,请稍后再试。	\N	2026-05-22 04:50:40.503898+00
2149	1	4	66	음성 인식 서비스에 연결할 수 없습니다. 나중에 다시 시도하세요.	\N	2026-05-22 04:50:40.503898+00
2150	1	5	66	音声認識サービスに接続できません。後でもう一度お試しください。	\N	2026-05-22 04:50:40.503898+00
2151	1	1	67	Cảm ơn câu hỏi của bạn: "{q}". Đây là phản hồi mẫu — tích hợp LLM thật sẽ thay thế hàm generateReply().	\N	2026-05-22 04:50:40.503898+00
2152	1	2	67	Thanks for your question: "{q}". This is a sample reply — real LLM integration will replace generateReply().	\N	2026-05-22 04:50:40.503898+00
2153	1	3	67	感谢您的提问:"{q}"。这是示例回复 — 真实 LLM 集成将替换 generateReply()。	\N	2026-05-22 04:50:40.503898+00
2154	1	4	67	질문 감사합니다: "{q}". 샘플 응답입니다 — 실제 LLM 통합이 generateReply()를 대체합니다.	\N	2026-05-22 04:50:40.503898+00
2155	1	5	67	ご質問ありがとうございます:"{q}"。これはサンプル応答です — 実際のLLM統合がgenerateReply()を置き換えます。	\N	2026-05-22 04:50:40.503898+00
2156	1	1	68	Logo dự án — quay về tổng quan.	\N	2026-05-22 04:50:40.503898+00
2157	1	2	68	Project logo — return to overview.	\N	2026-05-22 04:50:40.503898+00
2158	1	3	68	项目标志 — 返回总览。	\N	2026-05-22 04:50:40.503898+00
2159	1	4	68	프로젝트 로고 — 개요로 돌아갑니다.	\N	2026-05-22 04:50:40.503898+00
2160	1	5	68	プロジェクトロゴ — 概要に戻る。	\N	2026-05-22 04:50:40.503898+00
2161	1	1	69	Bản đồ thiết kế 2D — các điểm chạm dẫn vào không gian 360°.	\N	2026-05-22 04:50:40.503898+00
2162	1	2	69	2D design map — touch points lead into 360° spaces.	\N	2026-05-22 04:50:40.503898+00
2163	1	3	69	2D 设计图 — 触点进入 360° 空间。	\N	2026-05-22 04:50:40.503898+00
2164	1	4	69	2D 설계 지도 — 터치 포인트로 360° 공간 진입.	\N	2026-05-22 04:50:40.503898+00
2165	1	5	69	2D設計マップ — タッチポイントから360°空間へ。	\N	2026-05-22 04:50:40.503898+00
2166	1	1	70	Quy hoạch tổng thể — xem mặt bằng phân khu toàn dự án.	\N	2026-05-22 04:50:40.503898+00
2167	1	2	70	Master plan — view the subdivision layout of the whole project.	\N	2026-05-22 04:50:40.503898+00
2168	1	3	70	总体规划 — 查看整个项目的分区布局。	\N	2026-05-22 04:50:40.503898+00
2169	1	4	70	마스터플랜 — 프로젝트 전체의 구역 배치 보기.	\N	2026-05-22 04:50:40.503898+00
2170	1	5	70	マスタープラン — プロジェクト全体の区画レイアウトを確認。	\N	2026-05-22 04:50:40.503898+00
2171	1	1	71	Bất động sản — danh sách sản phẩm, căn hộ đang mở bán.	\N	2026-05-22 04:50:40.503898+00
2172	1	2	71	Properties — list of units and apartments on sale.	\N	2026-05-22 04:50:40.503898+00
2173	1	3	71	房产 — 在售单元和公寓列表。	\N	2026-05-22 04:50:40.503898+00
2174	1	4	71	부동산 — 판매 중인 세대 및 아파트 목록.	\N	2026-05-22 04:50:40.503898+00
2175	1	5	71	不動産 — 販売中の住戸・アパート一覧。	\N	2026-05-22 04:50:40.503898+00
2176	1	1	72	Tiện ích dự án — khám phá tiện ích nội/ngoại khu.	\N	2026-05-22 04:50:40.503898+00
2177	1	2	72	Project amenities — explore internal and external facilities.	\N	2026-05-22 04:50:40.503898+00
2178	1	3	72	项目配套 — 探索内部和外部设施。	\N	2026-05-22 04:50:40.503898+00
2179	1	4	72	프로젝트 시설 — 내부 및 외부 시설 살펴보기.	\N	2026-05-22 04:50:40.503898+00
2180	1	5	72	プロジェクト設備 — 敷地内・敷地外の設備を探索。	\N	2026-05-22 04:50:40.503898+00
2181	1	1	73	Pháp lý & Uy tín — hồ sơ pháp lý, ngân hàng bảo lãnh, đánh giá cư dân.	\N	2026-05-22 04:50:40.503898+00
2182	1	2	73	Legal & Credibility — legal records, guarantor banks, resident reviews.	\N	2026-05-22 04:50:40.503898+00
2183	1	3	73	法律与信誉 — 法律文件、担保银行、住户评价。	\N	2026-05-22 04:50:40.503898+00
2184	1	4	73	법률 및 신뢰성 — 법률 서류, 보증 은행, 입주민 평가.	\N	2026-05-22 04:50:40.503898+00
2185	1	5	73	法務と信頼性 — 法的書類、保証銀行、住民レビュー。	\N	2026-05-22 04:50:40.503898+00
2186	1	1	74	Vị trí dự án — bản đồ và các tiện ích xung quanh.	\N	2026-05-22 04:50:40.503898+00
2187	1	2	74	Project location — map and surrounding amenities.	\N	2026-05-22 04:50:40.503898+00
2188	1	3	74	项目位置 — 地图及周边配套。	\N	2026-05-22 04:50:40.503898+00
2189	1	4	74	프로젝트 위치 — 지도 및 주변 시설.	\N	2026-05-22 04:50:40.503898+00
2190	1	5	74	プロジェクト立地 — 地図と周辺施設。	\N	2026-05-22 04:50:40.503898+00
2191	1	1	75	Tiến độ dự án — xem các mốc thi công và bàn giao.	\N	2026-05-22 04:50:40.503898+00
2192	1	2	75	Project timeline — view construction and handover milestones.	\N	2026-05-22 04:50:40.503898+00
2193	1	3	75	项目进度 — 查看施工和交付里程碑。	\N	2026-05-22 04:50:40.503898+00
2194	1	4	75	프로젝트 진행 상황 — 시공 및 인도 일정 보기.	\N	2026-05-22 04:50:40.503898+00
2195	1	5	75	プロジェクト進捗 — 施工・引き渡しのマイルストーンを確認。	\N	2026-05-22 04:50:40.503898+00
2196	1	1	76	Thư viện ảnh dự án.	\N	2026-05-22 04:50:40.503898+00
2197	1	2	76	Project photo gallery.	\N	2026-05-22 04:50:40.503898+00
2198	1	3	76	项目图片库。	\N	2026-05-22 04:50:40.503898+00
2199	1	4	76	프로젝트 사진 갤러리.	\N	2026-05-22 04:50:40.503898+00
2200	1	5	76	プロジェクト写真ギャラリー。	\N	2026-05-22 04:50:40.503898+00
2201	1	1	77	Tài liệu dự án — brochure, bảng giá, mặt bằng để tải về.	\N	2026-05-22 04:50:40.503898+00
2202	1	2	77	Project documents — brochure, price list, floor plans to download.	\N	2026-05-22 04:50:40.503898+00
2203	1	3	77	项目资料 — 可下载的宣传册、价格表、平面图。	\N	2026-05-22 04:50:40.503898+00
2204	1	4	77	프로젝트 자료 — 다운로드 가능한 브로슈어, 가격표, 평면도.	\N	2026-05-22 04:50:40.503898+00
2205	1	5	77	プロジェクト資料 — ダウンロード可能なパンフレット、価格表、間取り図。	\N	2026-05-22 04:50:40.503898+00
2206	1	1	78	Đặt lịch tham quan và xem bảng giá chi tiết.	\N	2026-05-22 04:50:40.503898+00
2207	1	2	78	Book a tour and view detailed pricing.	\N	2026-05-22 04:50:40.503898+00
2208	1	3	78	预约参观并查看详细价格。	\N	2026-05-22 04:50:40.503898+00
2209	1	4	78	투어 예약 및 상세 가격표 보기.	\N	2026-05-22 04:50:40.503898+00
2210	1	5	78	見学予約と詳細な価格表の確認。	\N	2026-05-22 04:50:40.503898+00
2211	1	1	79	Cụm điều khiển — tự xoay, zoom, toàn màn hình, chọn ngôn ngữ và mở lại hướng dẫn.	\N	2026-05-22 04:50:40.503898+00
2212	1	2	79	Controls — auto-rotate, zoom, fullscreen, language and reopen the guide.	\N	2026-05-22 04:50:40.503898+00
2213	1	3	79	控制组 — 自动旋转、缩放、全屏、语言和重新打开指南。	\N	2026-05-22 04:50:40.503898+00
2214	1	4	79	컨트롤 — 자동 회전, 확대, 전체화면, 언어, 가이드 재열기.	\N	2026-05-22 04:50:40.503898+00
2215	1	5	79	コントロール — 自動回転、ズーム、フルスクリーン、言語、ガイド再表示。	\N	2026-05-22 04:50:40.503898+00
2216	1	1	80	Bật/tắt tự xoay panorama 360°.	\N	2026-05-22 04:50:40.503898+00
2217	1	2	80	Toggle 360° panorama auto-rotate.	\N	2026-05-22 04:50:40.503898+00
2218	1	3	80	开关 360° 全景自动旋转。	\N	2026-05-22 04:50:40.503898+00
2219	1	4	80	360° 파노라마 자동 회전 켜기/끄기.	\N	2026-05-22 04:50:40.503898+00
2220	1	5	80	360°パノラマの自動回転をオン/オフ。	\N	2026-05-22 04:50:40.503898+00
2221	1	1	81	Phóng to góc nhìn.	\N	2026-05-22 04:50:40.503898+00
2222	1	2	81	Zoom in.	\N	2026-05-22 04:50:40.503898+00
2223	1	3	81	放大视角。	\N	2026-05-22 04:50:40.503898+00
2224	1	4	81	시점 확대.	\N	2026-05-22 04:50:40.503898+00
2225	1	5	81	視点を拡大。	\N	2026-05-22 04:50:40.503898+00
2226	1	1	82	Thu nhỏ góc nhìn.	\N	2026-05-22 04:50:40.503898+00
2227	1	2	82	Zoom out.	\N	2026-05-22 04:50:40.503898+00
2228	1	3	82	缩小视角。	\N	2026-05-22 04:50:40.503898+00
2229	1	4	82	시점 축소.	\N	2026-05-22 04:50:40.503898+00
2230	1	5	82	視点を縮小。	\N	2026-05-22 04:50:40.503898+00
2231	1	1	83	Bật chế độ toàn màn hình.	\N	2026-05-22 04:50:40.503898+00
2232	1	2	83	Enter fullscreen mode.	\N	2026-05-22 04:50:40.503898+00
2233	1	3	83	进入全屏模式。	\N	2026-05-22 04:50:40.503898+00
2234	1	4	83	전체 화면 모드 시작.	\N	2026-05-22 04:50:40.503898+00
2235	1	5	83	フルスクリーンモードに入る。	\N	2026-05-22 04:50:40.503898+00
2236	1	1	84	Đa ngôn ngữ — chọn ngôn ngữ hiển thị (Việt, Anh, Trung, Hàn, Nhật).	\N	2026-05-22 04:50:40.503898+00
2237	1	2	84	Multi-language — choose the display language (Vietnamese, English, Chinese, Korean, Japanese).	\N	2026-05-22 04:50:40.503898+00
2238	1	3	84	多语言 — 选择显示语言(越南语、英语、中文、韩语、日语)。	\N	2026-05-22 04:50:40.503898+00
2239	1	4	84	다국어 — 표시 언어 선택 (베트남어, 영어, 중국어, 한국어, 일본어).	\N	2026-05-22 04:50:40.503898+00
2240	1	5	84	多言語 — 表示言語を選択(ベトナム語、英語、中国語、韓国語、日本語)。	\N	2026-05-22 04:50:40.503898+00
2241	1	1	85	Mở lại hướng dẫn này bất cứ lúc nào.	\N	2026-05-22 04:50:40.503898+00
2242	1	2	85	Reopen this guide anytime.	\N	2026-05-22 04:50:40.503898+00
2243	1	3	85	随时重新打开此指南。	\N	2026-05-22 04:50:40.503898+00
2244	1	4	85	언제든지 이 가이드 다시 열기.	\N	2026-05-22 04:50:40.503898+00
2245	1	5	85	いつでもこのガイドを再表示。	\N	2026-05-22 04:50:40.503898+00
2246	1	1	86	Bảng điều hướng trái — chứa thông tin scene và danh sách các nhóm.	\N	2026-05-22 04:50:40.503898+00
2247	1	2	86	Left navigation — scene info and group list.	\N	2026-05-22 04:50:40.503898+00
2248	1	3	86	左侧导航 — 包含场景信息和分组列表。	\N	2026-05-22 04:50:40.503898+00
2249	1	4	86	왼쪽 내비게이션 — 장면 정보와 그룹 목록.	\N	2026-05-22 04:50:40.503898+00
2250	1	5	86	左ナビゲーション — シーン情報とグループ一覧。	\N	2026-05-22 04:50:40.503898+00
2251	1	1	87	Tìm kiếm nhanh trong toàn bộ danh sách.	\N	2026-05-22 04:50:40.503898+00
2252	1	2	87	Quickly search the entire list.	\N	2026-05-22 04:50:40.503898+00
2253	1	3	87	快速搜索整个列表。	\N	2026-05-22 04:50:40.503898+00
2254	1	4	87	전체 목록 빠른 검색.	\N	2026-05-22 04:50:40.503898+00
2255	1	5	87	リスト全体を素早く検索。	\N	2026-05-22 04:50:40.503898+00
2256	1	1	88	Các nhóm: Tổng quan, Tiện ích nội/ngoại khu, Mặt bằng, Căn hộ. Click vào tiêu đề để mở/đóng nhóm, click vào mục con để chuyển không gian 360°.	\N	2026-05-22 04:50:40.503898+00
2257	1	2	88	Groups: Overview, Internal/External amenities, Floor plans, Units. Click headers to expand/collapse, click items to switch the 360° space.	\N	2026-05-22 04:50:40.503898+00
2258	1	3	88	分组:总览、内部/外部配套、平面图、单元。点击标题展开/收起,点击子项切换 360° 空间。	\N	2026-05-22 04:50:40.503898+00
2259	1	4	88	그룹: 개요, 내부/외부 시설, 평면도, 세대. 헤더 클릭으로 펼치기/접기, 항목 클릭으로 360° 공간 전환.	\N	2026-05-22 04:50:40.503898+00
2260	1	5	88	グループ:概要、敷地内/外設備、フロアプラン、住戸。ヘッダークリックで展開/折りたたみ、項目クリックで360°空間を切り替え。	\N	2026-05-22 04:50:40.503898+00
2261	1	1	89	Thu gọn bảng điều hướng để xem panorama rộng hơn.	\N	2026-05-22 04:50:40.503898+00
2262	1	2	89	Collapse the navigation panel for a wider panorama view.	\N	2026-05-22 04:50:40.503898+00
2263	1	3	89	收起导航面板以获得更宽的全景视图。	\N	2026-05-22 04:50:40.503898+00
2264	1	4	89	내비게이션 패널을 접어 더 넓은 파노라마 보기.	\N	2026-05-22 04:50:40.503898+00
2265	1	5	89	ナビゲーションパネルを折りたたんでパノラマを広く表示。	\N	2026-05-22 04:50:40.503898+00
2266	1	1	90	Thông tin dự án: giá, trạng thái, các chỉ số chính.	\N	2026-05-22 04:50:40.503898+00
2267	1	2	90	Project info: price, status, key stats.	\N	2026-05-22 04:50:40.503898+00
2268	1	3	90	项目信息:价格、状态、关键指标。	\N	2026-05-22 04:50:40.503898+00
2269	1	4	90	프로젝트 정보: 가격, 상태, 주요 지표.	\N	2026-05-22 04:50:40.503898+00
2270	1	5	90	プロジェクト情報:価格、ステータス、主要指標。	\N	2026-05-22 04:50:40.503898+00
2271	1	1	91	Thu gọn bảng thông tin dự án bên phải.	\N	2026-05-22 04:50:40.503898+00
2272	1	2	91	Collapse the project info panel on the right.	\N	2026-05-22 04:50:40.503898+00
2273	1	3	91	收起右侧的项目信息面板。	\N	2026-05-22 04:50:40.503898+00
2274	1	4	91	오른쪽 프로젝트 정보 패널을 접습니다.	\N	2026-05-22 04:50:40.503898+00
2275	1	5	91	右側のプロジェクト情報パネルを折りたたみます。	\N	2026-05-22 04:50:40.503898+00
2276	1	1	92	Mở lại bảng thông tin dự án khi đã thu gọn.	\N	2026-05-22 04:50:40.503898+00
2277	1	2	92	Reopen the project info panel when collapsed.	\N	2026-05-22 04:50:40.503898+00
2278	1	3	92	收起后重新打开项目信息面板。	\N	2026-05-22 04:50:40.503898+00
2279	1	4	92	접었을 때 프로젝트 정보 패널을 다시 엽니다.	\N	2026-05-22 04:50:40.503898+00
2280	1	5	92	折りたたんだプロジェクト情報パネルを再度開きます。	\N	2026-05-22 04:50:40.503898+00
2281	1	1	93	Trợ lý AI — chat text hoặc trò chuyện bằng giọng nói.	\N	2026-05-22 04:50:40.503898+00
2282	1	2	93	AI assistant — text chat or voice conversation.	\N	2026-05-22 04:50:40.503898+00
2283	1	3	93	AI 助理 — 文本聊天或语音对话。	\N	2026-05-22 04:50:40.503898+00
2284	1	4	93	AI 어시스턴트 — 텍스트 채팅 또는 음성 대화.	\N	2026-05-22 04:50:40.503898+00
2285	1	5	93	AIアシスタント — テキストチャットまたは音声会話。	\N	2026-05-22 04:50:40.503898+00
2286	1	1	94	Khi giao diện bị ẩn (do kéo xoay 360°), bấm nút này để hiện lại.	\N	2026-05-22 04:50:40.503898+00
2287	1	2	94	When the UI auto-hides (while dragging the 360° view), click this to bring it back.	\N	2026-05-22 04:50:40.503898+00
2288	1	3	94	当界面隐藏(拖动 360° 视角时),点击此按钮重新显示。	\N	2026-05-22 04:50:40.503898+00
2289	1	4	94	UI가 숨겨질 때(360° 드래그 시) 이 버튼을 눌러 다시 표시.	\N	2026-05-22 04:50:40.503898+00
2290	1	5	94	UIが非表示(360°ドラッグ時)になったら、このボタンで再表示。	\N	2026-05-22 04:50:40.503898+00
2291	1	1	95	Hotspot trong khung 360° — click để vào không gian khác hoặc xem mô tả.	\N	2026-05-22 04:50:40.503898+00
2292	1	2	95	Hotspot inside the 360° view — click to navigate or view a description.	\N	2026-05-22 04:50:40.503898+00
2293	1	3	95	360° 视图中的热点 — 点击导航或查看说明。	\N	2026-05-22 04:50:40.503898+00
2294	1	4	95	360° 뷰의 핫스팟 — 클릭하여 이동하거나 설명 보기.	\N	2026-05-22 04:50:40.503898+00
2295	1	5	95	360°ビューのホットスポット — クリックして移動または説明を表示。	\N	2026-05-22 04:50:40.503898+00
2296	1	1	96	VR360 EXPERIENCE	\N	2026-05-22 04:50:40.503898+00
2297	1	2	96	VR360 EXPERIENCE	\N	2026-05-22 04:50:40.503898+00
2298	1	3	96	VR360 EXPERIENCE	\N	2026-05-22 04:50:40.503898+00
2299	1	4	96	VR360 EXPERIENCE	\N	2026-05-22 04:50:40.503898+00
2300	1	5	96	VR360 EXPERIENCE	\N	2026-05-22 04:50:40.503898+00
2301	1	1	97	Hết ưu đãi	\N	2026-05-22 04:50:40.503898+00
2302	1	2	97	Offer expired	\N	2026-05-22 04:50:40.503898+00
2303	1	3	97	优惠已结束	\N	2026-05-22 04:50:40.503898+00
2304	1	4	97	혜택 종료	\N	2026-05-22 04:50:40.503898+00
2305	1	5	97	特典終了	\N	2026-05-22 04:50:40.503898+00
2306	1	1	98	Không tìm thấy căn phù hợp với bộ lọc	\N	2026-05-22 04:50:40.503898+00
2307	1	2	98	No units match the filter	\N	2026-05-22 04:50:40.503898+00
2308	1	3	98	没有符合筛选条件的房源	\N	2026-05-22 04:50:40.503898+00
2309	1	4	98	필터에 맞는 세대가 없습니다	\N	2026-05-22 04:50:40.503898+00
2310	1	5	98	フィルターに一致する住戸はありません	\N	2026-05-22 04:50:40.503898+00
2311	1	1	99	Studio	\N	2026-05-22 04:50:40.503898+00
2312	1	2	99	Studio	\N	2026-05-22 04:50:40.503898+00
2313	1	3	99	开间	\N	2026-05-22 04:50:40.503898+00
2314	1	4	99	스튜디오	\N	2026-05-22 04:50:40.503898+00
2315	1	5	99	スタジオ	\N	2026-05-22 04:50:40.503898+00
2316	1	1	100	— Chọn loại căn —	\N	2026-05-22 04:50:40.503898+00
2317	1	2	100	— Select unit type —	\N	2026-05-22 04:50:40.503898+00
2318	1	3	100	— 选择户型 —	\N	2026-05-22 04:50:40.503898+00
2319	1	4	100	— 유형 선택 —	\N	2026-05-22 04:50:40.503898+00
2320	1	5	100	— タイプを選択 —	\N	2026-05-22 04:50:40.503898+00
2321	1	1	101	Xoá	\N	2026-05-22 04:50:40.503898+00
2322	1	2	101	Remove	\N	2026-05-22 04:50:40.503898+00
2323	1	3	101	删除	\N	2026-05-22 04:50:40.503898+00
2324	1	4	101	삭제	\N	2026-05-22 04:50:40.503898+00
2325	1	5	101	削除	\N	2026-05-22 04:50:40.503898+00
2326	1	1	102	Vui lòng điền Họ tên và Số điện thoại.	\N	2026-05-22 04:50:40.503898+00
2327	1	2	102	Please enter your name and phone number.	\N	2026-05-22 04:50:40.503898+00
2328	1	3	102	请输入姓名和电话号码。	\N	2026-05-22 04:50:40.503898+00
2329	1	4	102	이름과 전화번호를 입력하세요.	\N	2026-05-22 04:50:40.503898+00
2330	1	5	102	お名前と電話番号を入力してください。	\N	2026-05-22 04:50:40.503898+00
2331	1	1	103	Số điện thoại chưa đúng định dạng (VD: 0901 234 567).	\N	2026-05-22 04:50:40.503898+00
2332	1	2	103	Phone number format is invalid (e.g. 0901 234 567).	\N	2026-05-22 04:50:40.503898+00
2333	1	3	103	电话号码格式不正确（例如：0901 234 567）。	\N	2026-05-22 04:50:40.503898+00
2334	1	4	103	전화번호 형식이 올바르지 않습니다 (예: 0901 234 567).	\N	2026-05-22 04:50:40.503898+00
2335	1	5	103	電話番号の形式が正しくありません（例：0901 234 567）。	\N	2026-05-22 04:50:40.503898+00
2336	1	1	104	Đang gửi…	\N	2026-05-22 04:50:40.503898+00
2337	1	2	104	Sending…	\N	2026-05-22 04:50:40.503898+00
2338	1	3	104	发送中…	\N	2026-05-22 04:50:40.503898+00
2339	1	4	104	전송 중…	\N	2026-05-22 04:50:40.503898+00
2340	1	5	104	送信中…	\N	2026-05-22 04:50:40.503898+00
2341	1	1	105	Email	\N	2026-05-22 04:50:40.503898+00
2342	1	2	105	Email	\N	2026-05-22 04:50:40.503898+00
2343	1	3	105	电子邮件	\N	2026-05-22 04:50:40.503898+00
2344	1	4	105	이메일	\N	2026-05-22 04:50:40.503898+00
2345	1	5	105	メール	\N	2026-05-22 04:50:40.503898+00
2346	1	1	106	(tuỳ chọn)	\N	2026-05-22 04:50:40.503898+00
2347	1	2	106	(optional)	\N	2026-05-22 04:50:40.503898+00
2348	1	3	106	（可选）	\N	2026-05-22 04:50:40.503898+00
2349	1	4	106	(선택)	\N	2026-05-22 04:50:40.503898+00
2350	1	5	106	（任意）	\N	2026-05-22 04:50:40.503898+00
2351	1	1	107	Zalo	\N	2026-05-22 04:50:40.503898+00
2352	1	2	107	Zalo	\N	2026-05-22 04:50:40.503898+00
2353	1	3	107	Zalo	\N	2026-05-22 04:50:40.503898+00
2354	1	4	107	Zalo	\N	2026-05-22 04:50:40.503898+00
2355	1	5	107	Zalo	\N	2026-05-22 04:50:40.503898+00
2356	1	1	108	(nếu khác SĐT)	\N	2026-05-22 04:50:40.503898+00
2357	1	2	108	(if different from phone)	\N	2026-05-22 04:50:40.503898+00
2358	1	3	108	（若与电话不同）	\N	2026-05-22 04:50:40.503898+00
2359	1	4	108	(전화와 다를 경우)	\N	2026-05-22 04:50:40.503898+00
2360	1	5	108	（電話と異なる場合）	\N	2026-05-22 04:50:40.503898+00
2361	1	1	109	Mã căn quan tâm	\N	2026-05-22 04:50:40.503898+00
2362	1	2	109	Units of interest	\N	2026-05-22 04:50:40.503898+00
2363	1	3	109	感兴趣的房源编号	\N	2026-05-22 04:50:40.503898+00
2364	1	4	109	관심 세대 코드	\N	2026-05-22 04:50:40.503898+00
2365	1	5	109	希望住戸コード	\N	2026-05-22 04:50:40.503898+00
2366	1	1	110	Ngân sách dự kiến	\N	2026-05-22 04:50:40.503898+00
2367	1	2	110	Estimated budget	\N	2026-05-22 04:50:40.503898+00
2368	1	3	110	预计预算	\N	2026-05-22 04:50:40.503898+00
2369	1	4	110	예상 예산	\N	2026-05-22 04:50:40.503898+00
2370	1	5	110	予算	\N	2026-05-22 04:50:40.503898+00
2371	1	1	111	Dưới 5 tỷ	\N	2026-05-22 04:50:40.503898+00
2372	1	2	111	Under 5B	\N	2026-05-22 04:50:40.503898+00
2373	1	3	111	500万以下	\N	2026-05-22 04:50:40.503898+00
2374	1	4	111	5억 미만	\N	2026-05-22 04:50:40.503898+00
2375	1	5	111	5B未満	\N	2026-05-22 04:50:40.503898+00
2376	1	1	112	5 – 8 tỷ	\N	2026-05-22 04:50:40.503898+00
2377	1	2	112	5 – 8B	\N	2026-05-22 04:50:40.503898+00
2378	1	3	112	500–800万	\N	2026-05-22 04:50:40.503898+00
2379	1	4	112	5–8억	\N	2026-05-22 04:50:40.503898+00
2380	1	5	112	5–8B	\N	2026-05-22 04:50:40.503898+00
2381	1	1	113	8 – 12 tỷ	\N	2026-05-22 04:50:40.503898+00
2382	1	2	113	8 – 12B	\N	2026-05-22 04:50:40.503898+00
2383	1	3	113	800–1200万	\N	2026-05-22 04:50:40.503898+00
2384	1	4	113	8–12억	\N	2026-05-22 04:50:40.503898+00
2385	1	5	113	8–12B	\N	2026-05-22 04:50:40.503898+00
2386	1	1	114	Trên 12 tỷ	\N	2026-05-22 04:50:40.503898+00
2387	1	2	114	Over 12B	\N	2026-05-22 04:50:40.503898+00
2388	1	3	114	1200万以上	\N	2026-05-22 04:50:40.503898+00
2389	1	4	114	12억 초과	\N	2026-05-22 04:50:40.503898+00
2390	1	5	114	12B超	\N	2026-05-22 04:50:40.503898+00
2391	1	1	115	Mục đích mua	\N	2026-05-22 04:50:40.503898+00
2392	1	2	115	Purchase purpose	\N	2026-05-22 04:50:40.503898+00
2393	1	3	115	购买目的	\N	2026-05-22 04:50:40.503898+00
2394	1	4	115	구매 목적	\N	2026-05-22 04:50:40.503898+00
2395	1	5	115	購入目的	\N	2026-05-22 04:50:40.503898+00
2396	1	1	116	Ở thực	\N	2026-05-22 04:50:40.503898+00
2397	1	2	116	To live in	\N	2026-05-22 04:50:40.503898+00
2398	1	3	116	自住	\N	2026-05-22 04:50:40.503898+00
2399	1	4	116	실거주	\N	2026-05-22 04:50:40.503898+00
2400	1	5	116	居住用	\N	2026-05-22 04:50:40.503898+00
2401	1	1	117	Đầu tư	\N	2026-05-22 04:50:40.503898+00
2402	1	2	117	Investment	\N	2026-05-22 04:50:40.503898+00
2403	1	3	117	投资	\N	2026-05-22 04:50:40.503898+00
2404	1	4	117	투자	\N	2026-05-22 04:50:40.503898+00
2405	1	5	117	投資	\N	2026-05-22 04:50:40.503898+00
2406	1	1	118	Cả hai	\N	2026-05-22 04:50:40.503898+00
2407	1	2	118	Both	\N	2026-05-22 04:50:40.503898+00
2408	1	3	118	两者兼有	\N	2026-05-22 04:50:40.503898+00
2409	1	4	118	둘 다	\N	2026-05-22 04:50:40.503898+00
2410	1	5	118	両方	\N	2026-05-22 04:50:40.503898+00
2411	1	1	119	Thời gian muốn xem	\N	2026-05-22 04:50:40.503898+00
2412	1	2	119	Preferred visit time	\N	2026-05-22 04:50:40.503898+00
2413	1	3	119	参观时间	\N	2026-05-22 04:50:40.503898+00
2414	1	4	119	선호 방문 시간	\N	2026-05-22 04:50:40.503898+00
2415	1	5	119	希望見学時間	\N	2026-05-22 04:50:40.503898+00
2416	1	1	120	Cuối tuần	\N	2026-05-22 04:50:40.503898+00
2417	1	2	120	Weekend	\N	2026-05-22 04:50:40.503898+00
2418	1	3	120	周末	\N	2026-05-22 04:50:40.503898+00
2419	1	4	120	주말	\N	2026-05-22 04:50:40.503898+00
2420	1	5	120	週末	\N	2026-05-22 04:50:40.503898+00
2421	1	1	121	Tuần tới	\N	2026-05-22 04:50:40.503898+00
2422	1	2	121	Next week	\N	2026-05-22 04:50:40.503898+00
2423	1	3	121	下周	\N	2026-05-22 04:50:40.503898+00
2424	1	4	121	다음 주	\N	2026-05-22 04:50:40.503898+00
2425	1	5	121	来週	\N	2026-05-22 04:50:40.503898+00
2426	1	1	122	Linh hoạt	\N	2026-05-22 04:50:40.503898+00
2427	1	2	122	Flexible	\N	2026-05-22 04:50:40.503898+00
2428	1	3	122	弹性	\N	2026-05-22 04:50:40.503898+00
2429	1	4	122	유동적	\N	2026-05-22 04:50:40.503898+00
2430	1	5	122	柔軟	\N	2026-05-22 04:50:40.503898+00
2431	1	1	123	Đồng ý nhận thông tin qua <strong>Zalo</strong>	\N	2026-05-22 04:50:40.503898+00
2432	1	2	123	Agree to receive info via <strong>Zalo</strong>	\N	2026-05-22 04:50:40.503898+00
2433	1	3	123	同意通过 <strong>Zalo</strong> 接收信息	\N	2026-05-22 04:50:40.503898+00
2434	1	4	123	<strong>Zalo</strong>로 정보 수신 동의	\N	2026-05-22 04:50:40.503898+00
2435	1	5	123	<strong>Zalo</strong>で情報を受け取ることに同意	\N	2026-05-22 04:50:40.503898+00
2436	1	1	124	Đồng ý nhận thông tin qua <strong>SMS</strong>	\N	2026-05-22 04:50:40.503898+00
2437	1	2	124	Agree to receive info via <strong>SMS</strong>	\N	2026-05-22 04:50:40.503898+00
2613	1	3	159	配套	\N	2026-05-22 04:50:40.503898+00
2438	1	3	124	同意通过 <strong>SMS</strong> 接收信息	\N	2026-05-22 04:50:40.503898+00
2439	1	4	124	<strong>SMS</strong>로 정보 수신 동의	\N	2026-05-22 04:50:40.503898+00
2440	1	5	124	<strong>SMS</strong>で情報を受け取ることに同意	\N	2026-05-22 04:50:40.503898+00
2441	1	1	125	Đã gửi thành công!	\N	2026-05-22 04:50:40.503898+00
2442	1	2	125	Sent successfully!	\N	2026-05-22 04:50:40.503898+00
2443	1	3	125	发送成功！	\N	2026-05-22 04:50:40.503898+00
2444	1	4	125	전송 완료!	\N	2026-05-22 04:50:40.503898+00
2445	1	5	125	送信完了！	\N	2026-05-22 04:50:40.503898+00
2446	1	1	126	Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.	\N	2026-05-22 04:50:40.503898+00
2447	1	2	126	We will contact you within <strong>30 minutes</strong> during business hours.	\N	2026-05-22 04:50:40.503898+00
2448	1	3	126	我们将在工作时间内<strong>30分钟内</strong>与您联系。	\N	2026-05-22 04:50:40.503898+00
2449	1	4	126	업무 시간 내 <strong>30분</strong> 이내에 연락드리겠습니다.	\N	2026-05-22 04:50:40.503898+00
2450	1	5	126	営業時間内に<strong>30分以内</strong>にご連絡します。	\N	2026-05-22 04:50:40.503898+00
2451	1	1	127	Chat Zalo ngay	\N	2026-05-22 04:50:40.503898+00
2452	1	2	127	Chat on Zalo now	\N	2026-05-22 04:50:40.503898+00
2453	1	3	127	立即 Zalo 联系	\N	2026-05-22 04:50:40.503898+00
2454	1	4	127	지금 Zalo 채팅	\N	2026-05-22 04:50:40.503898+00
2455	1	5	127	今すぐZaloでチャット	\N	2026-05-22 04:50:40.503898+00
2456	1	1	128	Gửi yêu cầu khác	\N	2026-05-22 04:50:40.503898+00
2457	1	2	128	Send another request	\N	2026-05-22 04:50:40.503898+00
2458	1	3	128	发送另一个请求	\N	2026-05-22 04:50:40.503898+00
2459	1	4	128	다른 요청 보내기	\N	2026-05-22 04:50:40.503898+00
2460	1	5	128	別のリクエストを送信	\N	2026-05-22 04:50:40.503898+00
2461	1	1	129	Đặt lịch tham quan	\N	2026-05-22 04:50:40.503898+00
2462	1	2	129	Book a tour	\N	2026-05-22 04:50:40.503898+00
2463	1	3	129	预约参观	\N	2026-05-22 04:50:40.503898+00
2464	1	4	129	투어 예약	\N	2026-05-22 04:50:40.503898+00
2465	1	5	129	見学予約	\N	2026-05-22 04:50:40.503898+00
2466	1	1	130	Chọn căn	\N	2026-05-22 04:50:40.503898+00
2467	1	2	130	Choose unit	\N	2026-05-22 04:50:40.503898+00
2468	1	3	130	选择房源	\N	2026-05-22 04:50:40.503898+00
2469	1	4	130	세대 선택	\N	2026-05-22 04:50:40.503898+00
2470	1	5	130	住戸選択	\N	2026-05-22 04:50:40.503898+00
2471	1	1	131	Thông tin	\N	2026-05-22 04:50:40.503898+00
2472	1	2	131	Information	\N	2026-05-22 04:50:40.503898+00
2473	1	3	131	信息	\N	2026-05-22 04:50:40.503898+00
2474	1	4	131	정보	\N	2026-05-22 04:50:40.503898+00
2475	1	5	131	情報	\N	2026-05-22 04:50:40.503898+00
2476	1	1	132	Xác nhận	\N	2026-05-22 04:50:40.503898+00
2477	1	2	132	Confirm	\N	2026-05-22 04:50:40.503898+00
2478	1	3	132	确认	\N	2026-05-22 04:50:40.503898+00
2479	1	4	132	확인	\N	2026-05-22 04:50:40.503898+00
2480	1	5	132	確認	\N	2026-05-22 04:50:40.503898+00
2481	1	1	133	Căn hộ quan tâm	\N	2026-05-22 04:50:40.503898+00
2482	1	2	133	Unit of interest	\N	2026-05-22 04:50:40.503898+00
2483	1	3	133	感兴趣的房源	\N	2026-05-22 04:50:40.503898+00
2484	1	4	133	관심 세대	\N	2026-05-22 04:50:40.503898+00
2485	1	5	133	希望住戸	\N	2026-05-22 04:50:40.503898+00
2486	1	1	134	Chưa chọn căn cụ thể →	\N	2026-05-22 04:50:40.503898+00
2487	1	2	134	Skip unit selection →	\N	2026-05-22 04:50:40.503898+00
2488	1	3	134	暂不选择具体房源 →	\N	2026-05-22 04:50:40.503898+00
2489	1	4	134	세대 선택 건너뛰기 →	\N	2026-05-22 04:50:40.503898+00
2490	1	5	134	住戸選択をスキップ →	\N	2026-05-22 04:50:40.503898+00
2491	1	1	135	Tất cả	\N	2026-05-22 04:50:40.503898+00
2492	1	2	135	All	\N	2026-05-22 04:50:40.503898+00
2493	1	3	135	全部	\N	2026-05-22 04:50:40.503898+00
2494	1	4	135	전체	\N	2026-05-22 04:50:40.503898+00
2495	1	5	135	すべて	\N	2026-05-22 04:50:40.503898+00
2496	1	1	136	Hướng	\N	2026-05-22 04:50:40.503898+00
2497	1	2	136	Dir.	\N	2026-05-22 04:50:40.503898+00
2498	1	3	136	朝向	\N	2026-05-22 04:50:40.503898+00
2499	1	4	136	향	\N	2026-05-22 04:50:40.503898+00
2500	1	5	136	向き	\N	2026-05-22 04:50:40.503898+00
2501	1	1	137	Tầng	\N	2026-05-22 04:50:40.503898+00
2502	1	2	137	Floor	\N	2026-05-22 04:50:40.503898+00
2503	1	3	137	楼层	\N	2026-05-22 04:50:40.503898+00
2504	1	4	137	층	\N	2026-05-22 04:50:40.503898+00
2505	1	5	137	階	\N	2026-05-22 04:50:40.503898+00
2506	1	1	138	Tiếp theo	\N	2026-05-22 04:50:40.503898+00
2507	1	2	138	Next	\N	2026-05-22 04:50:40.503898+00
2508	1	3	138	下一步	\N	2026-05-22 04:50:40.503898+00
2509	1	4	138	다음	\N	2026-05-22 04:50:40.503898+00
2510	1	5	138	次へ	\N	2026-05-22 04:50:40.503898+00
2511	1	1	139	Gửi yêu cầu	\N	2026-05-22 04:50:40.503898+00
2512	1	2	139	Submit	\N	2026-05-22 04:50:40.503898+00
2513	1	3	139	提交	\N	2026-05-22 04:50:40.503898+00
2514	1	4	139	제출	\N	2026-05-22 04:50:40.503898+00
2515	1	5	139	送信	\N	2026-05-22 04:50:40.503898+00
2516	1	1	140	Quay lại	\N	2026-05-22 04:50:40.503898+00
2517	1	2	140	Back	\N	2026-05-22 04:50:40.503898+00
2518	1	3	140	返回	\N	2026-05-22 04:50:40.503898+00
2519	1	4	140	뒤로	\N	2026-05-22 04:50:40.503898+00
2520	1	5	140	戻る	\N	2026-05-22 04:50:40.503898+00
2521	1	1	141	Kiểm tra lại thông tin	\N	2026-05-22 04:50:40.503898+00
2522	1	2	141	Review your information	\N	2026-05-22 04:50:40.503898+00
2523	1	3	141	确认信息	\N	2026-05-22 04:50:40.503898+00
2524	1	4	141	정보 확인	\N	2026-05-22 04:50:40.503898+00
2525	1	5	141	情報の確認	\N	2026-05-22 04:50:40.503898+00
2526	1	1	142	Nhấn <strong style="color:var(--accent)">Gửi yêu cầu</strong> để hoàn tất.<br/>Chúng tôi sẽ liên hệ trong <strong style="color:var(--fg)">30 phút</strong>.	\N	2026-05-22 04:50:40.503898+00
2527	1	2	142	Press <strong style="color:var(--accent)">Submit</strong> to complete.<br/>We will contact you within <strong style="color:var(--fg)">30 minutes</strong>.	\N	2026-05-22 04:50:40.503898+00
2528	1	3	142	点击<strong style="color:var(--accent)">提交</strong>完成。<br/>我们将在<strong style="color:var(--fg)">30分钟</strong>内联系您。	\N	2026-05-22 04:50:40.503898+00
2529	1	4	142	<strong style="color:var(--accent)">제출</strong>을 눌러 완료하세요.<br/>저희가 <strong style="color:var(--fg)">30분</strong> 내에 연락드리겠습니다.	\N	2026-05-22 04:50:40.503898+00
2530	1	5	142	<strong style="color:var(--accent)">送信</strong>を押して完了してください。<br/><strong style="color:var(--fg)">30分</strong>以内にご連絡します。	\N	2026-05-22 04:50:40.503898+00
2531	1	1	143	Đã gửi thành công!	\N	2026-05-22 04:50:40.503898+00
2532	1	2	143	Sent successfully!	\N	2026-05-22 04:50:40.503898+00
2533	1	3	143	发送成功！	\N	2026-05-22 04:50:40.503898+00
2534	1	4	143	전송 완료!	\N	2026-05-22 04:50:40.503898+00
2535	1	5	143	送信完了！	\N	2026-05-22 04:50:40.503898+00
2536	1	1	144	Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.	\N	2026-05-22 04:50:40.503898+00
2537	1	2	144	We will contact you within <strong>30 minutes</strong> during business hours.	\N	2026-05-22 04:50:40.503898+00
2538	1	3	144	我们将在工作时间内<strong>30分钟内</strong>与您联系。	\N	2026-05-22 04:50:40.503898+00
2539	1	4	144	업무 시간 내 <strong>30분</strong> 이내에 연락드리겠습니다.	\N	2026-05-22 04:50:40.503898+00
2540	1	5	144	営業時間内に<strong>30分以内</strong>にご連絡します。	\N	2026-05-22 04:50:40.503898+00
2541	1	1	145	Chat Zalo ngay	\N	2026-05-22 04:50:40.503898+00
2542	1	2	145	Chat on Zalo now	\N	2026-05-22 04:50:40.503898+00
2543	1	3	145	立即 Zalo 联系	\N	2026-05-22 04:50:40.503898+00
2544	1	4	145	지금 Zalo 채팅	\N	2026-05-22 04:50:40.503898+00
2545	1	5	145	今すぐZaloでチャット	\N	2026-05-22 04:50:40.503898+00
2546	1	1	146	Gửi yêu cầu khác	\N	2026-05-22 04:50:40.503898+00
2547	1	2	146	Send another request	\N	2026-05-22 04:50:40.503898+00
2548	1	3	146	发送另一个请求	\N	2026-05-22 04:50:40.503898+00
2549	1	4	146	다른 요청 보내기	\N	2026-05-22 04:50:40.503898+00
2550	1	5	146	別のリクエストを送信	\N	2026-05-22 04:50:40.503898+00
2551	1	1	147	Căn đã chọn	\N	2026-05-22 04:50:40.503898+00
2552	1	2	147	Selected unit	\N	2026-05-22 04:50:40.503898+00
2553	1	3	147	已选房源	\N	2026-05-22 04:50:40.503898+00
2554	1	4	147	선택한 세대	\N	2026-05-22 04:50:40.503898+00
2555	1	5	147	選択した住戸	\N	2026-05-22 04:50:40.503898+00
2556	1	1	148	Thông tin liên hệ	\N	2026-05-22 04:50:40.503898+00
2557	1	2	148	Contact information	\N	2026-05-22 04:50:40.503898+00
2558	1	3	148	联系信息	\N	2026-05-22 04:50:40.503898+00
2559	1	4	148	연락처 정보	\N	2026-05-22 04:50:40.503898+00
2560	1	5	148	連絡先情報	\N	2026-05-22 04:50:40.503898+00
2561	1	1	149	Yêu cầu	\N	2026-05-22 04:50:40.503898+00
2562	1	2	149	Request	\N	2026-05-22 04:50:40.503898+00
2563	1	3	149	需求	\N	2026-05-22 04:50:40.503898+00
2564	1	4	149	요청	\N	2026-05-22 04:50:40.503898+00
2565	1	5	149	リクエスト	\N	2026-05-22 04:50:40.503898+00
2566	1	1	150	Họ tên	\N	2026-05-22 04:50:40.503898+00
2567	1	2	150	Name	\N	2026-05-22 04:50:40.503898+00
2568	1	3	150	姓名	\N	2026-05-22 04:50:40.503898+00
2569	1	4	150	이름	\N	2026-05-22 04:50:40.503898+00
2570	1	5	150	氏名	\N	2026-05-22 04:50:40.503898+00
2571	1	1	151	Điện thoại	\N	2026-05-22 04:50:40.503898+00
2572	1	2	151	Phone	\N	2026-05-22 04:50:40.503898+00
2573	1	3	151	电话	\N	2026-05-22 04:50:40.503898+00
2574	1	4	151	전화	\N	2026-05-22 04:50:40.503898+00
2575	1	5	151	電話	\N	2026-05-22 04:50:40.503898+00
2576	1	1	152	Ngân sách	\N	2026-05-22 04:50:40.503898+00
2577	1	2	152	Budget	\N	2026-05-22 04:50:40.503898+00
2578	1	3	152	预算	\N	2026-05-22 04:50:40.503898+00
2579	1	4	152	예산	\N	2026-05-22 04:50:40.503898+00
2580	1	5	152	予算	\N	2026-05-22 04:50:40.503898+00
2581	1	1	153	Mục đích	\N	2026-05-22 04:50:40.503898+00
2582	1	2	153	Purpose	\N	2026-05-22 04:50:40.503898+00
2583	1	3	153	目的	\N	2026-05-22 04:50:40.503898+00
2584	1	4	153	목적	\N	2026-05-22 04:50:40.503898+00
2585	1	5	153	目的	\N	2026-05-22 04:50:40.503898+00
2586	1	1	154	Thời gian xem	\N	2026-05-22 04:50:40.503898+00
2587	1	2	154	Visit time	\N	2026-05-22 04:50:40.503898+00
2588	1	3	154	参观时间	\N	2026-05-22 04:50:40.503898+00
2589	1	4	154	방문 시간	\N	2026-05-22 04:50:40.503898+00
2590	1	5	154	見学時間	\N	2026-05-22 04:50:40.503898+00
2591	1	1	155	Ghi chú	\N	2026-05-22 04:50:40.503898+00
2592	1	2	155	Note	\N	2026-05-22 04:50:40.503898+00
2593	1	3	155	备注	\N	2026-05-22 04:50:40.503898+00
2594	1	4	155	메모	\N	2026-05-22 04:50:40.503898+00
2595	1	5	155	備考	\N	2026-05-22 04:50:40.503898+00
2596	1	1	156	Nhận tin	\N	2026-05-22 04:50:40.503898+00
2597	1	2	156	Notifications	\N	2026-05-22 04:50:40.503898+00
2598	1	3	156	接收通知	\N	2026-05-22 04:50:40.503898+00
2599	1	4	156	알림	\N	2026-05-22 04:50:40.503898+00
2600	1	5	156	通知	\N	2026-05-22 04:50:40.503898+00
2601	1	1	157	Masterplan	\N	2026-05-22 04:50:40.503898+00
2602	1	2	157	Masterplan	\N	2026-05-22 04:50:40.503898+00
2603	1	3	157	总体规划	\N	2026-05-22 04:50:40.503898+00
2604	1	4	157	마스터플랜	\N	2026-05-22 04:50:40.503898+00
2605	1	5	157	マスタープラン	\N	2026-05-22 04:50:40.503898+00
2606	1	1	158	Bất động sản	\N	2026-05-22 04:50:40.503898+00
2607	1	2	158	Properties	\N	2026-05-22 04:50:40.503898+00
2608	1	3	158	房产	\N	2026-05-22 04:50:40.503898+00
2609	1	4	158	부동산	\N	2026-05-22 04:50:40.503898+00
2610	1	5	158	不動産	\N	2026-05-22 04:50:40.503898+00
2611	1	1	159	Tiện ích	\N	2026-05-22 04:50:40.503898+00
2612	1	2	159	Amenities	\N	2026-05-22 04:50:40.503898+00
2614	1	4	159	편의시설	\N	2026-05-22 04:50:40.503898+00
2615	1	5	159	設備	\N	2026-05-22 04:50:40.503898+00
2616	1	1	160	Pháp lý	\N	2026-05-22 04:50:40.503898+00
2617	1	2	160	Legal	\N	2026-05-22 04:50:40.503898+00
2618	1	3	160	法律	\N	2026-05-22 04:50:40.503898+00
2619	1	4	160	법률	\N	2026-05-22 04:50:40.503898+00
2620	1	5	160	法務	\N	2026-05-22 04:50:40.503898+00
2621	1	1	161	Vị trí	\N	2026-05-22 04:50:40.503898+00
2622	1	2	161	Location	\N	2026-05-22 04:50:40.503898+00
2623	1	3	161	位置	\N	2026-05-22 04:50:40.503898+00
2624	1	4	161	위치	\N	2026-05-22 04:50:40.503898+00
2625	1	5	161	立地	\N	2026-05-22 04:50:40.503898+00
2626	1	1	162	Tiến độ	\N	2026-05-22 04:50:40.503898+00
2627	1	2	162	Progress	\N	2026-05-22 04:50:40.503898+00
2628	1	3	162	进度	\N	2026-05-22 04:50:40.503898+00
2629	1	4	162	진행	\N	2026-05-22 04:50:40.503898+00
2630	1	5	162	進捗	\N	2026-05-22 04:50:40.503898+00
2631	1	1	163	Tài liệu	\N	2026-05-22 04:50:40.503898+00
2632	1	2	163	Documents	\N	2026-05-22 04:50:40.503898+00
2633	1	3	163	资料	\N	2026-05-22 04:50:40.503898+00
2634	1	4	163	자료	\N	2026-05-22 04:50:40.503898+00
2635	1	5	163	資料	\N	2026-05-22 04:50:40.503898+00
2636	1	1	164	Menu	\N	2026-05-22 04:50:40.503898+00
2637	1	2	164	Menu	\N	2026-05-22 04:50:40.503898+00
2638	1	3	164	菜单	\N	2026-05-22 04:50:40.503898+00
2639	1	4	164	메뉴	\N	2026-05-22 04:50:40.503898+00
2640	1	5	164	メニュー	\N	2026-05-22 04:50:40.503898+00
2641	1	1	165	Thông tin dự án	\N	2026-05-22 04:50:40.503898+00
2642	1	2	165	Project info	\N	2026-05-22 04:50:40.503898+00
2643	1	3	165	项目信息	\N	2026-05-22 04:50:40.503898+00
2644	1	4	165	프로젝트 정보	\N	2026-05-22 04:50:40.503898+00
2645	1	5	165	プロジェクト情報	\N	2026-05-22 04:50:40.503898+00
2646	1	1	166	Mở thông tin dự án	\N	2026-05-22 04:50:40.503898+00
2647	1	2	166	Open project info	\N	2026-05-22 04:50:40.503898+00
2648	1	3	166	打开项目信息	\N	2026-05-22 04:50:40.503898+00
2649	1	4	166	프로젝트 정보 열기	\N	2026-05-22 04:50:40.503898+00
2650	1	5	166	プロジェクト情報を開く	\N	2026-05-22 04:50:40.503898+00
2651	1	1	167	Quy hoạch tổng thể	\N	2026-05-22 04:50:40.503898+00
2652	1	2	167	Master plan	\N	2026-05-22 04:50:40.503898+00
2653	1	3	167	总体规划	\N	2026-05-22 04:50:40.503898+00
2654	1	4	167	마스터플랜	\N	2026-05-22 04:50:40.503898+00
2655	1	5	167	全体計画	\N	2026-05-22 04:50:40.503898+00
2656	1	1	168	Bất động sản	\N	2026-05-22 04:50:40.503898+00
2657	1	2	168	Properties	\N	2026-05-22 04:50:40.503898+00
2658	1	3	168	房产	\N	2026-05-22 04:50:40.503898+00
2659	1	4	168	부동산	\N	2026-05-22 04:50:40.503898+00
2660	1	5	168	不動産	\N	2026-05-22 04:50:40.503898+00
2661	1	1	169	Tiện ích dự án	\N	2026-05-22 04:50:40.503898+00
2662	1	2	169	Project amenities	\N	2026-05-22 04:50:40.503898+00
2663	1	3	169	项目配套	\N	2026-05-22 04:50:40.503898+00
2664	1	4	169	프로젝트 시설	\N	2026-05-22 04:50:40.503898+00
2665	1	5	169	プロジェクト設備	\N	2026-05-22 04:50:40.503898+00
2666	1	1	170	Pháp lý & Uy tín	\N	2026-05-22 04:50:40.503898+00
2667	1	2	170	Legal & Credibility	\N	2026-05-22 04:50:40.503898+00
2668	1	3	170	法律与信誉	\N	2026-05-22 04:50:40.503898+00
2669	1	4	170	법률 및 신뢰성	\N	2026-05-22 04:50:40.503898+00
2670	1	5	170	法務と信頼性	\N	2026-05-22 04:50:40.503898+00
2671	1	1	171	Vị trí dự án	\N	2026-05-22 04:50:40.503898+00
2672	1	2	171	Project location	\N	2026-05-22 04:50:40.503898+00
2673	1	3	171	项目位置	\N	2026-05-22 04:50:40.503898+00
2674	1	4	171	프로젝트 위치	\N	2026-05-22 04:50:40.503898+00
2675	1	5	171	プロジェクト立地	\N	2026-05-22 04:50:40.503898+00
2676	1	1	172	Tiến độ dự án	\N	2026-05-22 04:50:40.503898+00
2677	1	2	172	Project progress	\N	2026-05-22 04:50:40.503898+00
2678	1	3	172	项目进度	\N	2026-05-22 04:50:40.503898+00
2679	1	4	172	프로젝트 진행	\N	2026-05-22 04:50:40.503898+00
2680	1	5	172	プロジェクト進捗	\N	2026-05-22 04:50:40.503898+00
2681	1	1	173	Tài liệu dự án	\N	2026-05-22 04:50:40.503898+00
2682	1	2	173	Project documents	\N	2026-05-22 04:50:40.503898+00
2683	1	3	173	项目资料	\N	2026-05-22 04:50:40.503898+00
2684	1	4	173	프로젝트 자료	\N	2026-05-22 04:50:40.503898+00
2685	1	5	173	プロジェクト資料	\N	2026-05-22 04:50:40.503898+00
2686	1	1	174	Đóng	\N	2026-05-22 04:50:40.503898+00
2687	1	2	174	Close	\N	2026-05-22 04:50:40.503898+00
2688	1	3	174	关闭	\N	2026-05-22 04:50:40.503898+00
2689	1	4	174	닫기	\N	2026-05-22 04:50:40.503898+00
2690	1	5	174	閉じる	\N	2026-05-22 04:50:40.503898+00
2691	1	1	175	Tiện ích Vinhomes Hai Van Bay	\N	2026-05-22 04:50:40.503898+00
2692	1	2	175	Vinhomes Hai Van Bay amenities	\N	2026-05-22 04:50:40.503898+00
2693	1	3	175	Vinhomes Hai Van Bay 配套	\N	2026-05-22 04:50:40.503898+00
2694	1	4	175	Vinhomes Hai Van Bay 편의시설	\N	2026-05-22 04:50:40.503898+00
2695	1	5	175	Vinhomes Hai Van Bay の設備	\N	2026-05-22 04:50:40.503898+00
2696	1	1	176	Hệ thống tiện ích đẳng cấp	\N	2026-05-22 04:50:40.503898+00
2697	1	2	176	Premium amenity system	\N	2026-05-22 04:50:40.503898+00
2698	1	3	176	高端配套系统	\N	2026-05-22 04:50:40.503898+00
2699	1	4	176	프리미엄 편의시설 시스템	\N	2026-05-22 04:50:40.503898+00
2700	1	5	176	高級設備システム	\N	2026-05-22 04:50:40.503898+00
2701	1	1	177	Nội khu	\N	2026-05-22 04:50:40.503898+00
2702	1	2	177	Internal	\N	2026-05-22 04:50:40.503898+00
2703	1	3	177	内部	\N	2026-05-22 04:50:40.503898+00
2704	1	4	177	내부	\N	2026-05-22 04:50:40.503898+00
2705	1	5	177	敷地内	\N	2026-05-22 04:50:40.503898+00
2706	1	1	178	Cao tầng	\N	2026-05-22 04:50:40.503898+00
2707	1	2	178	High-rise	\N	2026-05-22 04:50:40.503898+00
2708	1	3	178	高层	\N	2026-05-22 04:50:40.503898+00
2709	1	4	178	고층	\N	2026-05-22 04:50:40.503898+00
2710	1	5	178	高層	\N	2026-05-22 04:50:40.503898+00
2711	1	1	179	Dịch vụ	\N	2026-05-22 04:50:40.503898+00
2712	1	2	179	Services	\N	2026-05-22 04:50:40.503898+00
2713	1	3	179	服务	\N	2026-05-22 04:50:40.503898+00
2714	1	4	179	서비스	\N	2026-05-22 04:50:40.503898+00
2715	1	5	179	サービス	\N	2026-05-22 04:50:40.503898+00
2716	1	1	180	Hạ tầng	\N	2026-05-22 04:50:40.503898+00
2717	1	2	180	Infrastructure	\N	2026-05-22 04:50:40.503898+00
2718	1	3	180	基础设施	\N	2026-05-22 04:50:40.503898+00
2719	1	4	180	인프라	\N	2026-05-22 04:50:40.503898+00
2720	1	5	180	インフラ	\N	2026-05-22 04:50:40.503898+00
2721	1	1	181	Pháp lý & Uy tín	\N	2026-05-22 04:50:40.503898+00
2722	1	2	181	Legal & Credibility	\N	2026-05-22 04:50:40.503898+00
2723	1	3	181	法律与信誉	\N	2026-05-22 04:50:40.503898+00
2724	1	4	181	법률 및 신뢰성	\N	2026-05-22 04:50:40.503898+00
2725	1	5	181	法務と信頼性	\N	2026-05-22 04:50:40.503898+00
2726	1	1	182	Minh bạch — Bảo đảm — Tin cậy	\N	2026-05-22 04:50:40.503898+00
2727	1	2	182	Transparent — Secured — Trusted	\N	2026-05-22 04:50:40.503898+00
2728	1	3	182	透明 — 保障 — 可信	\N	2026-05-22 04:50:40.503898+00
2729	1	4	182	투명 — 보장 — 신뢰	\N	2026-05-22 04:50:40.503898+00
2730	1	5	182	透明 — 保証 — 信頼	\N	2026-05-22 04:50:40.503898+00
2731	1	1	183	Hồ sơ pháp lý	\N	2026-05-22 04:50:40.503898+00
2732	1	2	183	Legal records	\N	2026-05-22 04:50:40.503898+00
2733	1	3	183	法律文件	\N	2026-05-22 04:50:40.503898+00
2734	1	4	183	법률 서류	\N	2026-05-22 04:50:40.503898+00
2735	1	5	183	法的書類	\N	2026-05-22 04:50:40.503898+00
2736	1	1	184	Cư dân nói gì	\N	2026-05-22 04:50:40.503898+00
2737	1	2	184	What residents say	\N	2026-05-22 04:50:40.503898+00
2738	1	3	184	住户评价	\N	2026-05-22 04:50:40.503898+00
2739	1	4	184	입주민 평가	\N	2026-05-22 04:50:40.503898+00
2740	1	5	184	住民の声	\N	2026-05-22 04:50:40.503898+00
2741	1	1	185	Vị trí dự án	\N	2026-05-22 04:50:40.503898+00
2742	1	2	185	Project location	\N	2026-05-22 04:50:40.503898+00
2743	1	3	185	项目位置	\N	2026-05-22 04:50:40.503898+00
2744	1	4	185	프로젝트 위치	\N	2026-05-22 04:50:40.503898+00
2745	1	5	185	プロジェクト立地	\N	2026-05-22 04:50:40.503898+00
2746	1	1	186	Kết nối hoàn hảo	\N	2026-05-22 04:50:40.503898+00
2747	1	2	186	Perfect connectivity	\N	2026-05-22 04:50:40.503898+00
2748	1	3	186	完美连接	\N	2026-05-22 04:50:40.503898+00
2749	1	4	186	완벽한 연결	\N	2026-05-22 04:50:40.503898+00
2750	1	5	186	完璧なアクセス	\N	2026-05-22 04:50:40.503898+00
2751	1	1	187	Tất cả	\N	2026-05-22 04:50:40.503898+00
2752	1	2	187	All	\N	2026-05-22 04:50:40.503898+00
2753	1	3	187	全部	\N	2026-05-22 04:50:40.503898+00
2754	1	4	187	전체	\N	2026-05-22 04:50:40.503898+00
2755	1	5	187	すべて	\N	2026-05-22 04:50:40.503898+00
2756	1	1	188	🏫 Trường học	\N	2026-05-22 04:50:40.503898+00
2757	1	2	188	🏫 Schools	\N	2026-05-22 04:50:40.503898+00
2758	1	3	188	🏫 学校	\N	2026-05-22 04:50:40.503898+00
2759	1	4	188	🏫 학교	\N	2026-05-22 04:50:40.503898+00
2760	1	5	188	🏫 学校	\N	2026-05-22 04:50:40.503898+00
2761	1	1	189	🏥 Bệnh viện	\N	2026-05-22 04:50:40.503898+00
2762	1	2	189	🏥 Hospitals	\N	2026-05-22 04:50:40.503898+00
2763	1	3	189	🏥 医院	\N	2026-05-22 04:50:40.503898+00
2764	1	4	189	🏥 병원	\N	2026-05-22 04:50:40.503898+00
2765	1	5	189	🏥 病院	\N	2026-05-22 04:50:40.503898+00
2766	1	1	190	🚇 Metro	\N	2026-05-22 04:50:40.503898+00
2767	1	2	190	🚇 Metro	\N	2026-05-22 04:50:40.503898+00
2768	1	3	190	🚇 地铁	\N	2026-05-22 04:50:40.503898+00
2769	1	4	190	🚇 메트로	\N	2026-05-22 04:50:40.503898+00
2770	1	5	190	🚇 メトロ	\N	2026-05-22 04:50:40.503898+00
2771	1	1	191	🛍 TTTM	\N	2026-05-22 04:50:40.503898+00
2772	1	2	191	🛍 Malls	\N	2026-05-22 04:50:40.503898+00
2773	1	3	191	🛍 购物中心	\N	2026-05-22 04:50:40.503898+00
2774	1	4	191	🛍 쇼핑몰	\N	2026-05-22 04:50:40.503898+00
2775	1	5	191	🛍 モール	\N	2026-05-22 04:50:40.503898+00
2776	1	1	192	✈ Sân bay	\N	2026-05-22 04:50:40.503898+00
2777	1	2	192	✈ Airport	\N	2026-05-22 04:50:40.503898+00
2778	1	3	192	✈ 机场	\N	2026-05-22 04:50:40.503898+00
2779	1	4	192	✈ 공항	\N	2026-05-22 04:50:40.503898+00
2780	1	5	192	✈ 空港	\N	2026-05-22 04:50:40.503898+00
2781	1	1	193	Tiến độ xây dựng	\N	2026-05-22 04:50:40.503898+00
2782	1	2	193	Construction progress	\N	2026-05-22 04:50:40.503898+00
2783	1	3	193	施工进度	\N	2026-05-22 04:50:40.503898+00
2784	1	4	193	시공 진행	\N	2026-05-22 04:50:40.503898+00
2785	1	5	193	建設進捗	\N	2026-05-22 04:50:40.503898+00
2786	1	1	194	Cập nhật thực địa	\N	2026-05-22 04:50:40.503898+00
2787	1	2	194	On-site updates	\N	2026-05-22 04:50:40.503898+00
2788	1	3	194	现场更新	\N	2026-05-22 04:50:40.503898+00
2789	1	4	194	현장 업데이트	\N	2026-05-22 04:50:40.503898+00
2790	1	5	194	現地アップデート	\N	2026-05-22 04:50:40.503898+00
2791	1	1	195	Tài liệu	\N	2026-05-22 04:50:40.503898+00
2792	1	2	195	Documents	\N	2026-05-22 04:50:40.503898+00
2793	1	3	195	资料	\N	2026-05-22 04:50:40.503898+00
2794	1	4	195	자료	\N	2026-05-22 04:50:40.503898+00
2795	1	5	195	資料	\N	2026-05-22 04:50:40.503898+00
2796	1	1	196	Brochure, Bảng giá, Bộ nhận diện	\N	2026-05-22 04:50:40.503898+00
2797	1	2	196	Brochure, Price list, Brand kit	\N	2026-05-22 04:50:40.503898+00
2798	1	3	196	宣传册、价格表、品牌识别	\N	2026-05-22 04:50:40.503898+00
2799	1	4	196	브로슈어, 가격표, 브랜드 키트	\N	2026-05-22 04:50:40.503898+00
2800	1	5	196	パンフレット、価格表、ブランドキット	\N	2026-05-22 04:50:40.503898+00
2801	1	1	197	Sản phẩm dự án	\N	2026-05-22 04:50:40.503898+00
2802	1	2	197	Project products	\N	2026-05-22 04:50:40.503898+00
2803	1	3	197	项目产品	\N	2026-05-22 04:50:40.503898+00
2804	1	4	197	프로젝트 상품	\N	2026-05-22 04:50:40.503898+00
2805	1	5	197	プロジェクト商品	\N	2026-05-22 04:50:40.503898+00
2806	1	1	198	Bất động sản đang mở bán	\N	2026-05-22 04:50:40.503898+00
2807	1	2	198	Properties on sale	\N	2026-05-22 04:50:40.503898+00
2808	1	3	198	在售房产	\N	2026-05-22 04:50:40.503898+00
2809	1	4	198	분양 중인 부동산	\N	2026-05-22 04:50:40.503898+00
2810	1	5	198	販売中の不動産	\N	2026-05-22 04:50:40.503898+00
2811	1	1	199	Tìm theo mã căn, tên sản phẩm…	\N	2026-05-22 04:50:40.503898+00
2812	1	2	199	Search by unit code or product name…	\N	2026-05-22 04:50:40.503898+00
2813	1	3	199	按房源编号、产品名称搜索……	\N	2026-05-22 04:50:40.503898+00
2814	1	4	199	세대 코드, 상품명으로 검색…	\N	2026-05-22 04:50:40.503898+00
2815	1	5	199	住戸コード・商品名で検索…	\N	2026-05-22 04:50:40.503898+00
2816	1	1	200	Lọc	\N	2026-05-22 04:50:40.503898+00
2817	1	2	200	Filter	\N	2026-05-22 04:50:40.503898+00
2818	1	3	200	筛选	\N	2026-05-22 04:50:40.503898+00
2819	1	4	200	필터	\N	2026-05-22 04:50:40.503898+00
2820	1	5	200	絞り込み	\N	2026-05-22 04:50:40.503898+00
2821	1	1	201	Bộ lọc	\N	2026-05-22 04:50:40.503898+00
2822	1	2	201	Filters	\N	2026-05-22 04:50:40.503898+00
2823	1	3	201	筛选器	\N	2026-05-22 04:50:40.503898+00
2824	1	4	201	필터	\N	2026-05-22 04:50:40.503898+00
2825	1	5	201	フィルター	\N	2026-05-22 04:50:40.503898+00
2826	1	1	202	Đóng bộ lọc	\N	2026-05-22 04:50:40.503898+00
2827	1	2	202	Close filters	\N	2026-05-22 04:50:40.503898+00
2828	1	3	202	关闭筛选	\N	2026-05-22 04:50:40.503898+00
2829	1	4	202	필터 닫기	\N	2026-05-22 04:50:40.503898+00
2830	1	5	202	フィルターを閉じる	\N	2026-05-22 04:50:40.503898+00
2831	1	1	203	Xóa bộ lọc	\N	2026-05-22 04:50:40.503898+00
2832	1	2	203	Clear filters	\N	2026-05-22 04:50:40.503898+00
2833	1	3	203	清除筛选	\N	2026-05-22 04:50:40.503898+00
2834	1	4	203	필터 초기화	\N	2026-05-22 04:50:40.503898+00
2835	1	5	203	フィルターをクリア	\N	2026-05-22 04:50:40.503898+00
2836	1	1	204	‹ Danh sách	\N	2026-05-22 04:50:40.503898+00
2837	1	2	204	‹ List	\N	2026-05-22 04:50:40.503898+00
2838	1	3	204	‹ 列表	\N	2026-05-22 04:50:40.503898+00
2839	1	4	204	‹ 목록	\N	2026-05-22 04:50:40.503898+00
2840	1	5	204	‹ 一覧	\N	2026-05-22 04:50:40.503898+00
2841	1	1	205	Mặt bằng	\N	2026-05-22 04:50:40.503898+00
2842	1	2	205	Floor plan	\N	2026-05-22 04:50:40.503898+00
2843	1	3	205	平面图	\N	2026-05-22 04:50:40.503898+00
2844	1	4	205	평면도	\N	2026-05-22 04:50:40.503898+00
2845	1	5	205	間取り図	\N	2026-05-22 04:50:40.503898+00
2846	1	1	206	Phóng to	\N	2026-05-22 04:50:40.503898+00
2847	1	2	206	Zoom in	\N	2026-05-22 04:50:40.503898+00
2848	1	3	206	放大	\N	2026-05-22 04:50:40.503898+00
2849	1	4	206	확대	\N	2026-05-22 04:50:40.503898+00
2850	1	5	206	拡大	\N	2026-05-22 04:50:40.503898+00
2851	1	1	207	Thu nhỏ	\N	2026-05-22 04:50:40.503898+00
2852	1	2	207	Zoom out	\N	2026-05-22 04:50:40.503898+00
2853	1	3	207	缩小	\N	2026-05-22 04:50:40.503898+00
2854	1	4	207	축소	\N	2026-05-22 04:50:40.503898+00
2855	1	5	207	縮小	\N	2026-05-22 04:50:40.503898+00
2856	1	1	208	Đặt lại	\N	2026-05-22 04:50:40.503898+00
2857	1	2	208	Reset	\N	2026-05-22 04:50:40.503898+00
2858	1	3	208	重置	\N	2026-05-22 04:50:40.503898+00
2859	1	4	208	초기화	\N	2026-05-22 04:50:40.503898+00
2860	1	5	208	リセット	\N	2026-05-22 04:50:40.503898+00
2861	1	1	209	Cuộn để phóng to · Kéo để di chuyển	\N	2026-05-22 04:50:40.503898+00
2862	1	2	209	Scroll to zoom · Drag to pan	\N	2026-05-22 04:50:40.503898+00
2863	1	3	209	滚动缩放 · 拖动平移	\N	2026-05-22 04:50:40.503898+00
2864	1	4	209	스크롤로 확대 · 드래그로 이동	\N	2026-05-22 04:50:40.503898+00
2865	1	5	209	スクロールで拡大 · ドラッグで移動	\N	2026-05-22 04:50:40.503898+00
2866	1	1	210	Bộ lọc Masterplan	\N	2026-05-22 04:50:40.503898+00
2867	1	2	210	Masterplan filters	\N	2026-05-22 04:50:40.503898+00
2868	1	3	210	总体规划筛选	\N	2026-05-22 04:50:40.503898+00
2869	1	4	210	마스터플랜 필터	\N	2026-05-22 04:50:40.503898+00
2870	1	5	210	マスタープランフィルター	\N	2026-05-22 04:50:40.503898+00
2871	1	1	211	Đặt lại	\N	2026-05-22 04:50:40.503898+00
2872	1	2	211	Reset	\N	2026-05-22 04:50:40.503898+00
2873	1	3	211	重置	\N	2026-05-22 04:50:40.503898+00
2874	1	4	211	초기화	\N	2026-05-22 04:50:40.503898+00
2875	1	5	211	リセット	\N	2026-05-22 04:50:40.503898+00
2876	1	1	212	Áp dụng	\N	2026-05-22 04:50:40.503898+00
2877	1	2	212	Apply	\N	2026-05-22 04:50:40.503898+00
2878	1	3	212	应用	\N	2026-05-22 04:50:40.503898+00
2879	1	4	212	적용	\N	2026-05-22 04:50:40.503898+00
2880	1	5	212	適用	\N	2026-05-22 04:50:40.503898+00
2881	1	1	213	Đóng	\N	2026-05-22 04:50:40.503898+00
2882	1	2	213	Close	\N	2026-05-22 04:50:40.503898+00
2883	1	3	213	关闭	\N	2026-05-22 04:50:40.503898+00
2884	1	4	213	닫기	\N	2026-05-22 04:50:40.503898+00
2885	1	5	213	閉じる	\N	2026-05-22 04:50:40.503898+00
2886	1	1	214	Loại căn	\N	2026-05-22 04:50:40.503898+00
2887	1	2	214	Unit type	\N	2026-05-22 04:50:40.503898+00
2888	1	3	214	户型	\N	2026-05-22 04:50:40.503898+00
2889	1	4	214	유형	\N	2026-05-22 04:50:40.503898+00
2890	1	5	214	タイプ	\N	2026-05-22 04:50:40.503898+00
2891	1	1	215	Nhóm tầng	\N	2026-05-22 04:50:40.503898+00
2892	1	2	215	Floor group	\N	2026-05-22 04:50:40.503898+00
2893	1	3	215	楼层组	\N	2026-05-22 04:50:40.503898+00
2894	1	4	215	층 그룹	\N	2026-05-22 04:50:40.503898+00
2895	1	5	215	階グループ	\N	2026-05-22 04:50:40.503898+00
2896	1	1	216	Trạng thái	\N	2026-05-22 04:50:40.503898+00
2897	1	2	216	Status	\N	2026-05-22 04:50:40.503898+00
2898	1	3	216	状态	\N	2026-05-22 04:50:40.503898+00
2899	1	4	216	상태	\N	2026-05-22 04:50:40.503898+00
2900	1	5	216	ステータス	\N	2026-05-22 04:50:40.503898+00
2901	1	1	217	Xóa lọc	\N	2026-05-22 04:50:40.503898+00
2902	1	2	217	Clear filter	\N	2026-05-22 04:50:40.503898+00
2903	1	3	217	清除筛选	\N	2026-05-22 04:50:40.503898+00
2904	1	4	217	필터 초기화	\N	2026-05-22 04:50:40.503898+00
2905	1	5	217	フィルタークリア	\N	2026-05-22 04:50:40.503898+00
2906	1	1	218	Tất cả	\N	2026-05-22 04:50:40.503898+00
2907	1	2	218	All	\N	2026-05-22 04:50:40.503898+00
2908	1	3	218	全部	\N	2026-05-22 04:50:40.503898+00
2909	1	4	218	전체	\N	2026-05-22 04:50:40.503898+00
2910	1	5	218	すべて	\N	2026-05-22 04:50:40.503898+00
2911	1	1	219	Thấp (1–15)	\N	2026-05-22 04:50:40.503898+00
2912	1	2	219	Low (1–15)	\N	2026-05-22 04:50:40.503898+00
2913	1	3	219	低层 (1–15)	\N	2026-05-22 04:50:40.503898+00
2914	1	4	219	저층 (1–15)	\N	2026-05-22 04:50:40.503898+00
2915	1	5	219	低層 (1–15)	\N	2026-05-22 04:50:40.503898+00
2916	1	1	220	Trung (16–30)	\N	2026-05-22 04:50:40.503898+00
2917	1	2	220	Mid (16–30)	\N	2026-05-22 04:50:40.503898+00
2918	1	3	220	中层 (16–30)	\N	2026-05-22 04:50:40.503898+00
2919	1	4	220	중층 (16–30)	\N	2026-05-22 04:50:40.503898+00
2920	1	5	220	中層 (16–30)	\N	2026-05-22 04:50:40.503898+00
2921	1	1	221	Cao (31+)	\N	2026-05-22 04:50:40.503898+00
2922	1	2	221	High (31+)	\N	2026-05-22 04:50:40.503898+00
2923	1	3	221	高层 (31+)	\N	2026-05-22 04:50:40.503898+00
2924	1	4	221	고층 (31+)	\N	2026-05-22 04:50:40.503898+00
2925	1	5	221	高層 (31+)	\N	2026-05-22 04:50:40.503898+00
2926	1	1	222	Tất cả	\N	2026-05-22 04:50:40.503898+00
2927	1	2	222	All	\N	2026-05-22 04:50:40.503898+00
2928	1	3	222	全部	\N	2026-05-22 04:50:40.503898+00
2929	1	4	222	전체	\N	2026-05-22 04:50:40.503898+00
2930	1	5	222	すべて	\N	2026-05-22 04:50:40.503898+00
2931	1	1	223	Còn trống	\N	2026-05-22 04:50:40.503898+00
2932	1	2	223	Available	\N	2026-05-22 04:50:40.503898+00
2933	1	3	223	可售	\N	2026-05-22 04:50:40.503898+00
2934	1	4	223	분양 가능	\N	2026-05-22 04:50:40.503898+00
2935	1	5	223	空きあり	\N	2026-05-22 04:50:40.503898+00
2936	1	1	224	Đang giữ	\N	2026-05-22 04:50:40.503898+00
2937	1	2	224	On hold	\N	2026-05-22 04:50:40.503898+00
2938	1	3	224	保留中	\N	2026-05-22 04:50:40.503898+00
2939	1	4	224	보류 중	\N	2026-05-22 04:50:40.503898+00
2940	1	5	224	保留中	\N	2026-05-22 04:50:40.503898+00
2941	1	1	225	Đã bán	\N	2026-05-22 04:50:40.503898+00
2942	1	2	225	Sold	\N	2026-05-22 04:50:40.503898+00
2943	1	3	225	已售	\N	2026-05-22 04:50:40.503898+00
2944	1	4	225	판매됨	\N	2026-05-22 04:50:40.503898+00
2945	1	5	225	売却済み	\N	2026-05-22 04:50:40.503898+00
2946	1	1	226	Tầng	\N	2026-05-22 04:50:40.503898+00
2947	1	2	226	Floor	\N	2026-05-22 04:50:40.503898+00
2948	1	3	226	楼层	\N	2026-05-22 04:50:40.503898+00
2949	1	4	226	층	\N	2026-05-22 04:50:40.503898+00
2950	1	5	226	階	\N	2026-05-22 04:50:40.503898+00
2951	1	1	227	DT (m²)	\N	2026-05-22 04:50:40.503898+00
2952	1	2	227	Area (m²)	\N	2026-05-22 04:50:40.503898+00
2953	1	3	227	面积 (m²)	\N	2026-05-22 04:50:40.503898+00
2954	1	4	227	면적 (m²)	\N	2026-05-22 04:50:40.503898+00
2955	1	5	227	面積 (m²)	\N	2026-05-22 04:50:40.503898+00
2956	1	1	228	Hướng	\N	2026-05-22 04:50:40.503898+00
2957	1	2	228	Direction	\N	2026-05-22 04:50:40.503898+00
2958	1	3	228	朝向	\N	2026-05-22 04:50:40.503898+00
2959	1	4	228	향	\N	2026-05-22 04:50:40.503898+00
2960	1	5	228	向き	\N	2026-05-22 04:50:40.503898+00
2961	1	1	229	Giá/m²	\N	2026-05-22 04:50:40.503898+00
2962	1	2	229	Price/m²	\N	2026-05-22 04:50:40.503898+00
2963	1	3	229	单价/m²	\N	2026-05-22 04:50:40.503898+00
2964	1	4	229	㎡당 가격	\N	2026-05-22 04:50:40.503898+00
2965	1	5	229	㎡単価	\N	2026-05-22 04:50:40.503898+00
2966	1	1	230	TT	\N	2026-05-22 04:50:40.503898+00
2967	1	2	230	St.	\N	2026-05-22 04:50:40.503898+00
2968	1	3	230	状	\N	2026-05-22 04:50:40.503898+00
2969	1	4	230	상태	\N	2026-05-22 04:50:40.503898+00
2970	1	5	230	状	\N	2026-05-22 04:50:40.503898+00
2971	1	1	231	Giá	\N	2026-05-22 04:50:40.503898+00
2972	1	2	231	Price	\N	2026-05-22 04:50:40.503898+00
2973	1	3	231	价格	\N	2026-05-22 04:50:40.503898+00
2974	1	4	231	가격	\N	2026-05-22 04:50:40.503898+00
2975	1	5	231	価格	\N	2026-05-22 04:50:40.503898+00
2976	1	1	596	Phân khu	\N	2026-05-22 04:50:40.503898+00
2977	1	1	597	Phân khu	\N	2026-05-22 04:50:40.503898+00
2978	1	1	598	Tất cả	\N	2026-05-22 04:50:40.503898+00
2979	1	1	599	Đang lọc	\N	2026-05-22 04:50:40.503898+00
2980	1	1	600	Đang lọc theo	\N	2026-05-22 04:50:40.503898+00
2981	1	1	601	Tổng quan — hiển thị đầy đủ	\N	2026-05-22 04:50:40.503898+00
2982	1	1	602	Nội dung dự án	\N	2026-05-22 04:50:40.503898+00
2983	1	1	603	Chưa có nội dung	\N	2026-05-22 04:50:40.503898+00
2984	1	1	232	Khu Tây Hồ Tây, Hà Nội	\N	2026-05-22 04:50:40.503898+00
2985	1	2	232	Tay Ho Tay District, Hanoi	\N	2026-05-22 04:50:40.503898+00
2986	1	3	232	河内市西湖西区	\N	2026-05-22 04:50:40.503898+00
2987	1	4	232	하노이 떠이호떠이 지구	\N	2026-05-22 04:50:40.503898+00
2988	1	5	232	ハノイ・タイホータイ地区	\N	2026-05-22 04:50:40.503898+00
2989	1	1	233	Đang mở bán giai đoạn 2	\N	2026-05-22 04:50:40.503898+00
2990	1	2	233	Phase 2 selling now	\N	2026-05-22 04:50:40.503898+00
2991	1	3	233	第二期热销中	\N	2026-05-22 04:50:40.503898+00
2992	1	4	233	2단계 분양 중	\N	2026-05-22 04:50:40.503898+00
2993	1	5	233	第2期販売中	\N	2026-05-22 04:50:40.503898+00
2994	1	1	234	Từ 4.9 tỷ	\N	2026-05-22 04:50:40.503898+00
2995	1	2	234	From 4.9B VND	\N	2026-05-22 04:50:40.503898+00
2996	1	3	234	490亿越南盾起	\N	2026-05-22 04:50:40.503898+00
2997	1	4	234	49억 VND부터	\N	2026-05-22 04:50:40.503898+00
2998	1	5	234	49億VNDから	\N	2026-05-22 04:50:40.503898+00
2999	1	1	235	Bể bơi vô cực	\N	2026-05-22 04:50:40.503898+00
3000	1	2	235	Infinity pool	\N	2026-05-22 04:50:40.503898+00
3001	1	3	235	无边泳池	\N	2026-05-22 04:50:40.503898+00
3002	1	4	235	인피니티 풀	\N	2026-05-22 04:50:40.503898+00
3003	1	5	235	インフィニティプール	\N	2026-05-22 04:50:40.503898+00
3004	1	1	236	Gym & Yoga 1200m²	\N	2026-05-22 04:50:40.503898+00
3005	1	2	236	Gym & Yoga 1200m²	\N	2026-05-22 04:50:40.503898+00
3006	1	3	236	健身房&瑜伽 1200㎡	\N	2026-05-22 04:50:40.503898+00
3007	1	4	236	헬스 & 요가 1200㎡	\N	2026-05-22 04:50:40.503898+00
3008	1	5	236	ジム&ヨガ 1200㎡	\N	2026-05-22 04:50:40.503898+00
3009	1	1	237	Spa & Onsen	\N	2026-05-22 04:50:40.503898+00
3010	1	2	237	Spa & Onsen	\N	2026-05-22 04:50:40.503898+00
3011	1	3	237	水疗 & 温泉	\N	2026-05-22 04:50:40.503898+00
3012	1	4	237	스파 & 온천	\N	2026-05-22 04:50:40.503898+00
3013	1	5	237	スパ&温泉	\N	2026-05-22 04:50:40.503898+00
3014	1	1	238	Trường liên cấp song ngữ	\N	2026-05-22 04:50:40.503898+00
3015	1	2	238	Bilingual K-12 school	\N	2026-05-22 04:50:40.503898+00
3016	1	3	238	双语一贯制学校	\N	2026-05-22 04:50:40.503898+00
3017	1	4	238	이중언어 K-12 학교	\N	2026-05-22 04:50:40.503898+00
3018	1	5	238	バイリンガル一貫校	\N	2026-05-22 04:50:40.503898+00
3019	1	1	239	TTTM 18.000 m²	\N	2026-05-22 04:50:40.503898+00
3020	1	2	239	Mall 18,000 m²	\N	2026-05-22 04:50:40.503898+00
3021	1	3	239	购物中心 18,000㎡	\N	2026-05-22 04:50:40.503898+00
3022	1	4	239	쇼핑몰 18,000㎡	\N	2026-05-22 04:50:40.503898+00
3023	1	5	239	ショッピングモール18,000㎡	\N	2026-05-22 04:50:40.503898+00
3024	1	1	240	Công viên trung tâm	\N	2026-05-22 04:50:40.503898+00
3025	1	2	240	Central park	\N	2026-05-22 04:50:40.503898+00
3026	1	3	240	中央公园	\N	2026-05-22 04:50:40.503898+00
3027	1	4	240	센트럴 파크	\N	2026-05-22 04:50:40.503898+00
3028	1	5	240	セントラルパーク	\N	2026-05-22 04:50:40.503898+00
3029	1	1	241	Sky lounge tầng 42	\N	2026-05-22 04:50:40.503898+00
3030	1	2	241	Sky lounge — 42F	\N	2026-05-22 04:50:40.503898+00
3031	1	3	241	42层空中酒廊	\N	2026-05-22 04:50:40.503898+00
3032	1	4	241	42층 스카이 라운지	\N	2026-05-22 04:50:40.503898+00
3033	1	5	241	42階スカイラウンジ	\N	2026-05-22 04:50:40.503898+00
3034	1	1	242	Khu vui chơi trẻ em	\N	2026-05-22 04:50:40.503898+00
3035	1	2	242	Kids' playground	\N	2026-05-22 04:50:40.503898+00
3036	1	3	242	儿童游乐区	\N	2026-05-22 04:50:40.503898+00
3037	1	4	242	어린이 놀이터	\N	2026-05-22 04:50:40.503898+00
3038	1	5	242	キッズ遊び場	\N	2026-05-22 04:50:40.503898+00
3039	1	1	243	Cây xanh nội khu	\N	2026-05-22 04:50:40.503898+00
3040	1	2	243	Internal greenery	\N	2026-05-22 04:50:40.503898+00
3041	1	3	243	内部绿化	\N	2026-05-22 04:50:40.503898+00
3042	1	4	243	내부 녹지	\N	2026-05-22 04:50:40.503898+00
3043	1	5	243	敷地内緑地	\N	2026-05-22 04:50:40.503898+00
3044	1	1	244	Mật độ xây dựng	\N	2026-05-22 04:50:40.503898+00
3045	1	2	244	Building density	\N	2026-05-22 04:50:40.503898+00
3046	1	3	244	建筑密度	\N	2026-05-22 04:50:40.503898+00
3047	1	4	244	건축 밀도	\N	2026-05-22 04:50:40.503898+00
3048	1	5	244	建ぺい率	\N	2026-05-22 04:50:40.503898+00
3049	1	1	245	Tới hồ Tây	\N	2026-05-22 04:50:40.503898+00
3050	1	2	245	To West Lake	\N	2026-05-22 04:50:40.503898+00
3051	1	3	245	至西湖	\N	2026-05-22 04:50:40.503898+00
3052	1	4	245	서호까지	\N	2026-05-22 04:50:40.503898+00
3053	1	5	245	タイ湖まで	\N	2026-05-22 04:50:40.503898+00
3054	1	1	246	Tầm view panorama	\N	2026-05-22 04:50:40.503898+00
3055	1	2	246	Panorama view floors	\N	2026-05-22 04:50:40.503898+00
3056	1	3	246	全景视野楼层	\N	2026-05-22 04:50:40.503898+00
3057	1	4	246	파노라마 뷰 층	\N	2026-05-22 04:50:40.503898+00
3058	1	5	246	パノラマビュー階	\N	2026-05-22 04:50:40.503898+00
3059	1	1	247	ha	\N	2026-05-22 04:50:40.503898+00
3060	1	2	247	ha	\N	2026-05-22 04:50:40.503898+00
3061	1	3	247	公顷	\N	2026-05-22 04:50:40.503898+00
3062	1	4	247	ha	\N	2026-05-22 04:50:40.503898+00
3063	1	5	247	ha	\N	2026-05-22 04:50:40.503898+00
3064	1	1	248	phút	\N	2026-05-22 04:50:40.503898+00
3065	1	2	248	min	\N	2026-05-22 04:50:40.503898+00
3066	1	3	248	分钟	\N	2026-05-22 04:50:40.503898+00
3067	1	4	248	분	\N	2026-05-22 04:50:40.503898+00
3068	1	5	248	分	\N	2026-05-22 04:50:40.503898+00
3069	1	1	249	tầng	\N	2026-05-22 04:50:40.503898+00
3070	1	2	249	F	\N	2026-05-22 04:50:40.503898+00
3071	1	3	249	层	\N	2026-05-22 04:50:40.503898+00
3072	1	4	249	층	\N	2026-05-22 04:50:40.503898+00
3073	1	5	249	階	\N	2026-05-22 04:50:40.503898+00
3074	1	1	250	Tổng quan	\N	2026-05-22 04:50:40.503898+00
3075	1	2	250	Overview	\N	2026-05-22 04:50:40.503898+00
3076	1	3	250	总览	\N	2026-05-22 04:50:40.503898+00
3077	1	4	250	개요	\N	2026-05-22 04:50:40.503898+00
3078	1	5	250	概要	\N	2026-05-22 04:50:40.503898+00
3079	1	1	251	Tiện ích nội khu	\N	2026-05-22 04:50:40.503898+00
3080	1	2	251	Internal amenities	\N	2026-05-22 04:50:40.503898+00
3081	1	3	251	内部配套	\N	2026-05-22 04:50:40.503898+00
3082	1	4	251	내부 시설	\N	2026-05-22 04:50:40.503898+00
3083	1	5	251	敷地内設備	\N	2026-05-22 04:50:40.503898+00
3084	1	1	252	Tiện ích ngoại khu	\N	2026-05-22 04:50:40.503898+00
3085	1	2	252	External amenities	\N	2026-05-22 04:50:40.503898+00
3086	1	3	252	外部配套	\N	2026-05-22 04:50:40.503898+00
3087	1	4	252	외부 시설	\N	2026-05-22 04:50:40.503898+00
3088	1	5	252	敷地外設備	\N	2026-05-22 04:50:40.503898+00
3089	1	1	253	Mặt bằng tầng	\N	2026-05-22 04:50:40.503898+00
3090	1	2	253	Floor plans	\N	2026-05-22 04:50:40.503898+00
3091	1	3	253	楼层平面	\N	2026-05-22 04:50:40.503898+00
3092	1	4	253	층 평면도	\N	2026-05-22 04:50:40.503898+00
3093	1	5	253	フロアプラン	\N	2026-05-22 04:50:40.503898+00
3094	1	1	254	View 360 căn hộ	\N	2026-05-22 04:50:40.503898+00
3095	1	2	254	Unit 360° views	\N	2026-05-22 04:50:40.503898+00
3096	1	3	254	户型360°视图	\N	2026-05-22 04:50:40.503898+00
3097	1	4	254	세대 360° 뷰	\N	2026-05-22 04:50:40.503898+00
3098	1	5	254	住戸360°ビュー	\N	2026-05-22 04:50:40.503898+00
3099	1	1	255	Tổng quan (Top View)	\N	2026-05-22 04:50:40.503898+00
3100	1	2	255	Overview (Top View)	\N	2026-05-22 04:50:40.503898+00
3101	1	3	255	总览(俯视)	\N	2026-05-22 04:50:40.503898+00
3102	1	4	255	개요(탑뷰)	\N	2026-05-22 04:50:40.503898+00
3103	1	5	255	概要(トップビュー)	\N	2026-05-22 04:50:40.503898+00
3104	1	1	256	Tổng quan (View 1)	\N	2026-05-22 04:50:40.503898+00
3105	1	2	256	Overview (View 1)	\N	2026-05-22 04:50:40.503898+00
3106	1	3	256	总览(视角1)	\N	2026-05-22 04:50:40.503898+00
3107	1	4	256	개요(뷰 1)	\N	2026-05-22 04:50:40.503898+00
3108	1	5	256	概要(ビュー1)	\N	2026-05-22 04:50:40.503898+00
3109	1	1	257	Tổng quan (View 2)	\N	2026-05-22 04:50:40.503898+00
3110	1	2	257	Overview (View 2)	\N	2026-05-22 04:50:40.503898+00
3111	1	3	257	总览(视角2)	\N	2026-05-22 04:50:40.503898+00
3112	1	4	257	개요(뷰 2)	\N	2026-05-22 04:50:40.503898+00
3113	1	5	257	概要(ビュー2)	\N	2026-05-22 04:50:40.503898+00
3114	1	1	258	Tổng quan (View 3)	\N	2026-05-22 04:50:40.503898+00
3115	1	2	258	Overview (View 3)	\N	2026-05-22 04:50:40.503898+00
3116	1	3	258	总览(视角3)	\N	2026-05-22 04:50:40.503898+00
3117	1	4	258	개요(뷰 3)	\N	2026-05-22 04:50:40.503898+00
3118	1	5	258	概要(ビュー3)	\N	2026-05-22 04:50:40.503898+00
3119	1	1	259	Tổng quan (View 4)	\N	2026-05-22 04:50:40.503898+00
3120	1	2	259	Overview (View 4)	\N	2026-05-22 04:50:40.503898+00
3121	1	3	259	总览(视角4)	\N	2026-05-22 04:50:40.503898+00
3122	1	4	259	개요(뷰 4)	\N	2026-05-22 04:50:40.503898+00
3123	1	5	259	概要(ビュー4)	\N	2026-05-22 04:50:40.503898+00
3124	1	1	260	Tổng quan (View 5)	\N	2026-05-22 04:50:40.503898+00
3125	1	2	260	Overview (View 5)	\N	2026-05-22 04:50:40.503898+00
3126	1	3	260	总览(视角5)	\N	2026-05-22 04:50:40.503898+00
3127	1	4	260	개요(뷰 5)	\N	2026-05-22 04:50:40.503898+00
3128	1	5	260	概要(ビュー5)	\N	2026-05-22 04:50:40.503898+00
3129	1	1	261	Bể bơi	\N	2026-05-22 04:50:40.503898+00
3130	1	2	261	Pool	\N	2026-05-22 04:50:40.503898+00
3131	1	3	261	泳池	\N	2026-05-22 04:50:40.503898+00
3132	1	4	261	수영장	\N	2026-05-22 04:50:40.503898+00
3133	1	5	261	プール	\N	2026-05-22 04:50:40.503898+00
3134	1	1	262	Đường dạo bộ	\N	2026-05-22 04:50:40.503898+00
3135	1	2	262	Walking path	\N	2026-05-22 04:50:40.503898+00
3136	1	3	262	步道	\N	2026-05-22 04:50:40.503898+00
3137	1	4	262	산책로	\N	2026-05-22 04:50:40.503898+00
3138	1	5	262	散策路	\N	2026-05-22 04:50:40.503898+00
3139	1	1	263	Sân chơi trẻ em	\N	2026-05-22 04:50:40.503898+00
3140	1	2	263	Kids playground	\N	2026-05-22 04:50:40.503898+00
3141	1	3	263	儿童乐园	\N	2026-05-22 04:50:40.503898+00
3142	1	4	263	어린이 놀이터	\N	2026-05-22 04:50:40.503898+00
3143	1	5	263	キッズ遊び場	\N	2026-05-22 04:50:40.503898+00
3144	1	1	264	Sân thể thao	\N	2026-05-22 04:50:40.503898+00
3145	1	2	264	Sports court	\N	2026-05-22 04:50:40.503898+00
3146	1	3	264	运动场	\N	2026-05-22 04:50:40.503898+00
3147	1	4	264	스포츠 코트	\N	2026-05-22 04:50:40.503898+00
3148	1	5	264	スポーツコート	\N	2026-05-22 04:50:40.503898+00
3149	1	1	265	Sky Lounge	\N	2026-05-22 04:50:40.503898+00
3150	1	2	265	Sky Lounge	\N	2026-05-22 04:50:40.503898+00
3151	1	3	265	空中酒廊	\N	2026-05-22 04:50:40.503898+00
3152	1	4	265	스카이 라운지	\N	2026-05-22 04:50:40.503898+00
3153	1	5	265	スカイラウンジ	\N	2026-05-22 04:50:40.503898+00
3154	1	1	266	Tuyến Metro 6	\N	2026-05-22 04:50:40.503898+00
3155	1	2	266	Metro Line 6	\N	2026-05-22 04:50:40.503898+00
3156	1	3	266	6号地铁线	\N	2026-05-22 04:50:40.503898+00
3157	1	4	266	메트로 6호선	\N	2026-05-22 04:50:40.503898+00
3158	1	5	266	メトロ6号線	\N	2026-05-22 04:50:40.503898+00
3159	1	1	267	Tuyến đường Ánh Sáng	\N	2026-05-22 04:50:40.503898+00
3160	1	2	267	Anh Sang Avenue	\N	2026-05-22 04:50:40.503898+00
3161	1	3	267	光明大道	\N	2026-05-22 04:50:40.503898+00
3162	1	4	267	안상 대로	\N	2026-05-22 04:50:40.503898+00
3163	1	5	267	アンサン通り	\N	2026-05-22 04:50:40.503898+00
3164	1	1	268	Bệnh viện Quốc tế Vinmec	\N	2026-05-22 04:50:40.503898+00
3165	1	2	268	Vinmec Int'l Hospital	\N	2026-05-22 04:50:40.503898+00
3166	1	3	268	Vinmec 国际医院	\N	2026-05-22 04:50:40.503898+00
3167	1	4	268	빈멕 국제 병원	\N	2026-05-22 04:50:40.503898+00
3168	1	5	268	Vinmec国際病院	\N	2026-05-22 04:50:40.503898+00
3169	1	1	269	Zen Park	\N	2026-05-22 04:50:40.503898+00
3170	1	2	269	Zen Park	\N	2026-05-22 04:50:40.503898+00
3171	1	3	269	Zen 公园	\N	2026-05-22 04:50:40.503898+00
3172	1	4	269	젠 파크	\N	2026-05-22 04:50:40.503898+00
3173	1	5	269	ゼンパーク	\N	2026-05-22 04:50:40.503898+00
3174	1	1	270	Đại lộ Thăng Long	\N	2026-05-22 04:50:40.503898+00
3175	1	2	270	Thang Long Boulevard	\N	2026-05-22 04:50:40.503898+00
3176	1	3	270	升龙大道	\N	2026-05-22 04:50:40.503898+00
3177	1	4	270	탕롱 대로	\N	2026-05-22 04:50:40.503898+00
3178	1	5	270	タンロン大通り	\N	2026-05-22 04:50:40.503898+00
3179	1	1	271	Vincom Mega Mall	\N	2026-05-22 04:50:40.503898+00
3180	1	2	271	Vincom Mega Mall	\N	2026-05-22 04:50:40.503898+00
3181	1	3	271	Vincom Mega Mall	\N	2026-05-22 04:50:40.503898+00
3182	1	4	271	빈컴 메가몰	\N	2026-05-22 04:50:40.503898+00
3183	1	5	271	Vincom Mega Mall	\N	2026-05-22 04:50:40.503898+00
3184	1	1	272	TTTM & nhà để xe 10 tầng	\N	2026-05-22 04:50:40.503898+00
3185	1	2	272	Mall & 10F parking	\N	2026-05-22 04:50:40.503898+00
3186	1	3	272	购物中心&10层停车楼	\N	2026-05-22 04:50:40.503898+00
3187	1	4	272	쇼핑몰 & 10층 주차장	\N	2026-05-22 04:50:40.503898+00
3188	1	5	272	モール&10階駐車場	\N	2026-05-22 04:50:40.503898+00
3189	1	1	273	Central Park 10.2ha	\N	2026-05-22 04:50:40.503898+00
3190	1	2	273	Central Park 10.2ha	\N	2026-05-22 04:50:40.503898+00
3191	1	3	273	中央公园 10.2公顷	\N	2026-05-22 04:50:40.503898+00
3192	1	4	273	센트럴 파크 10.2ha	\N	2026-05-22 04:50:40.503898+00
3193	1	5	273	セントラルパーク10.2ha	\N	2026-05-22 04:50:40.503898+00
3194	1	1	274	Đường Lê Trọng Tấn	\N	2026-05-22 04:50:40.503898+00
3195	1	2	274	Le Trong Tan Street	\N	2026-05-22 04:50:40.503898+00
3196	1	3	274	黎仲晋路	\N	2026-05-22 04:50:40.503898+00
3197	1	4	274	레쫑떤 거리	\N	2026-05-22 04:50:40.503898+00
3198	1	5	274	レチョンタン通り	\N	2026-05-22 04:50:40.503898+00
3199	1	1	275	Trường THCS Nguyễn Quý Đức	\N	2026-05-22 04:50:40.503898+00
3200	1	2	275	Nguyen Quy Duc Secondary	\N	2026-05-22 04:50:40.503898+00
3201	1	3	275	阮贵德中学	\N	2026-05-22 04:50:40.503898+00
3202	1	4	275	응우옌꾸이득 중학교	\N	2026-05-22 04:50:40.503898+00
3203	1	5	275	グエン・クイ・ドゥック中学校	\N	2026-05-22 04:50:40.503898+00
3204	1	1	276	Tòa Thảo Mộc (I5)	\N	2026-05-22 04:50:40.503898+00
3205	1	2	276	Thao Moc Tower (I5)	\N	2026-05-22 04:50:40.503898+00
3206	1	3	276	草木塔 (I5)	\N	2026-05-22 04:50:40.503898+00
3207	1	4	276	타오목 타워 (I5)	\N	2026-05-22 04:50:40.503898+00
3208	1	5	276	タオモック棟 (I5)	\N	2026-05-22 04:50:40.503898+00
3209	1	1	277	Tòa Nguyệt Quế (I4)	\N	2026-05-22 04:50:40.503898+00
3210	1	2	277	Nguyet Que Tower (I4)	\N	2026-05-22 04:50:40.503898+00
3211	1	3	277	月桂塔 (I4)	\N	2026-05-22 04:50:40.503898+00
3212	1	4	277	응우옛꾸에 타워 (I4)	\N	2026-05-22 04:50:40.503898+00
3213	1	5	277	ニョットクエ棟 (I4)	\N	2026-05-22 04:50:40.503898+00
3214	1	1	278	Tòa The Central (I3)	\N	2026-05-22 04:50:40.503898+00
3215	1	2	278	The Central Tower (I3)	\N	2026-05-22 04:50:40.503898+00
3216	1	3	278	中央塔 (I3)	\N	2026-05-22 04:50:40.503898+00
3217	1	4	278	더 센트럴 (I3)	\N	2026-05-22 04:50:40.503898+00
3218	1	5	278	ザ・セントラル (I3)	\N	2026-05-22 04:50:40.503898+00
3219	1	1	279	Tòa The Park (I2)	\N	2026-05-22 04:50:40.503898+00
3220	1	2	279	The Park Tower (I2)	\N	2026-05-22 04:50:40.503898+00
3221	1	3	279	公园塔 (I2)	\N	2026-05-22 04:50:40.503898+00
3222	1	4	279	더 파크 (I2)	\N	2026-05-22 04:50:40.503898+00
3223	1	5	279	ザ・パーク (I2)	\N	2026-05-22 04:50:40.503898+00
3224	1	1	280	Tòa The Lake Premium (I1)	\N	2026-05-22 04:50:40.503898+00
3225	1	2	280	The Lake Premium Tower (I1)	\N	2026-05-22 04:50:40.503898+00
3226	1	3	280	湖景豪华塔 (I1)	\N	2026-05-22 04:50:40.503898+00
3227	1	4	280	더 레이크 프리미엄 (I1)	\N	2026-05-22 04:50:40.503898+00
3228	1	5	280	ザ・レイク・プレミアム (I1)	\N	2026-05-22 04:50:40.503898+00
3229	1	1	281	Studio - 34m²	\N	2026-05-22 04:50:40.503898+00
3230	1	2	281	Studio – 34m²	\N	2026-05-22 04:50:40.503898+00
3231	1	3	281	开间 – 34㎡	\N	2026-05-22 04:50:40.503898+00
3232	1	4	281	스튜디오 – 34㎡	\N	2026-05-22 04:50:40.503898+00
3233	1	5	281	スタジオ – 34㎡	\N	2026-05-22 04:50:40.503898+00
3234	1	1	282	Studio - 35.1m²	\N	2026-05-22 04:50:40.503898+00
3235	1	2	282	Studio – 35.1m²	\N	2026-05-22 04:50:40.503898+00
3236	1	3	282	开间 – 35.1㎡	\N	2026-05-22 04:50:40.503898+00
3237	1	4	282	스튜디오 – 35.1㎡	\N	2026-05-22 04:50:40.503898+00
3238	1	5	282	スタジオ – 35.1㎡	\N	2026-05-22 04:50:40.503898+00
3239	1	1	283	1 phòng ngủ + 1 - 43m²	\N	2026-05-22 04:50:40.503898+00
3240	1	2	283	1BR +1 – 43m²	\N	2026-05-22 04:50:40.503898+00
3241	1	3	283	1卧+1 – 43㎡	\N	2026-05-22 04:50:40.503898+00
3242	1	4	283	1BR +1 – 43㎡	\N	2026-05-22 04:50:40.503898+00
3243	1	5	283	1BR +1 – 43㎡	\N	2026-05-22 04:50:40.503898+00
3244	1	1	284	2 phòng ngủ + 1 - 46.4m²	\N	2026-05-22 04:50:40.503898+00
3245	1	2	284	2BR +1 – 46.4m²	\N	2026-05-22 04:50:40.503898+00
3246	1	3	284	2卧+1 – 46.4㎡	\N	2026-05-22 04:50:40.503898+00
3247	1	4	284	2BR +1 – 46.4㎡	\N	2026-05-22 04:50:40.503898+00
3248	1	5	284	2BR +1 – 46.4㎡	\N	2026-05-22 04:50:40.503898+00
3249	1	1	285	2 phòng ngủ + 1 - 54.6m²	\N	2026-05-22 04:50:40.503898+00
3250	1	2	285	2BR +1 – 54.6m²	\N	2026-05-22 04:50:40.503898+00
3251	1	3	285	2卧+1 – 54.6㎡	\N	2026-05-22 04:50:40.503898+00
3252	1	4	285	2BR +1 – 54.6㎡	\N	2026-05-22 04:50:40.503898+00
3253	1	5	285	2BR +1 – 54.6㎡	\N	2026-05-22 04:50:40.503898+00
3254	1	1	286	2 phòng ngủ + 1 - 54.7m²	\N	2026-05-22 04:50:40.503898+00
3255	1	2	286	2BR +1 – 54.7m²	\N	2026-05-22 04:50:40.503898+00
3256	1	3	286	2卧+1 – 54.7㎡	\N	2026-05-22 04:50:40.503898+00
3257	1	4	286	2BR +1 – 54.7㎡	\N	2026-05-22 04:50:40.503898+00
3258	1	5	286	2BR +1 – 54.7㎡	\N	2026-05-22 04:50:40.503898+00
3259	1	1	287	2 phòng ngủ + 1 - 59.2m²	\N	2026-05-22 04:50:40.503898+00
3260	1	2	287	2BR +1 – 59.2m²	\N	2026-05-22 04:50:40.503898+00
3261	1	3	287	2卧+1 – 59.2㎡	\N	2026-05-22 04:50:40.503898+00
3262	1	4	287	2BR +1 – 59.2㎡	\N	2026-05-22 04:50:40.503898+00
3263	1	5	287	2BR +1 – 59.2㎡	\N	2026-05-22 04:50:40.503898+00
3264	1	1	288	2 phòng ngủ + 1 - 62.2m²	\N	2026-05-22 04:50:40.503898+00
3265	1	2	288	2BR +1 – 62.2m²	\N	2026-05-22 04:50:40.503898+00
3266	1	3	288	2卧+1 – 62.2㎡	\N	2026-05-22 04:50:40.503898+00
3267	1	4	288	2BR +1 – 62.2㎡	\N	2026-05-22 04:50:40.503898+00
3268	1	5	288	2BR +1 – 62.2㎡	\N	2026-05-22 04:50:40.503898+00
3269	1	1	289	3 phòng ngủ - 74.5m²	\N	2026-05-22 04:50:40.503898+00
3270	1	2	289	3BR – 74.5m²	\N	2026-05-22 04:50:40.503898+00
3271	1	3	289	3卧 – 74.5㎡	\N	2026-05-22 04:50:40.503898+00
3272	1	4	289	3BR – 74.5㎡	\N	2026-05-22 04:50:40.503898+00
3273	1	5	289	3BR – 74.5㎡	\N	2026-05-22 04:50:40.503898+00
3274	1	1	290	3 phòng ngủ - 75.6m²	\N	2026-05-22 04:50:40.503898+00
3275	1	2	290	3BR – 75.6m²	\N	2026-05-22 04:50:40.503898+00
3276	1	3	290	3卧 – 75.6㎡	\N	2026-05-22 04:50:40.503898+00
3277	1	4	290	3BR – 75.6㎡	\N	2026-05-22 04:50:40.503898+00
3278	1	5	290	3BR – 75.6㎡	\N	2026-05-22 04:50:40.503898+00
3279	1	1	291	Sky Lounge — Tầng 42	\N	2026-05-22 04:50:40.503898+00
3280	1	2	291	Sky Lounge — 42F	\N	2026-05-22 04:50:40.503898+00
3281	1	3	291	空中酒廊 — 42层	\N	2026-05-22 04:50:40.503898+00
3282	1	4	291	스카이 라운지 — 42층	\N	2026-05-22 04:50:40.503898+00
3283	1	5	291	スカイラウンジ — 42階	\N	2026-05-22 04:50:40.503898+00
3284	1	1	292	Tầm nhìn 360° toàn cảnh thành phố	\N	2026-05-22 04:50:40.503898+00
3285	1	2	292	360° city panorama	\N	2026-05-22 04:50:40.503898+00
3286	1	3	292	360°城市全景	\N	2026-05-22 04:50:40.503898+00
3287	1	4	292	360° 도시 파노라마	\N	2026-05-22 04:50:40.503898+00
3288	1	5	292	360°都市パノラマ	\N	2026-05-22 04:50:40.503898+00
3289	1	1	293	Tiện ích	\N	2026-05-22 04:50:40.503898+00
3290	1	2	293	Amenity	\N	2026-05-22 04:50:40.503898+00
3291	1	3	293	配套	\N	2026-05-22 04:50:40.503898+00
3292	1	4	293	시설	\N	2026-05-22 04:50:40.503898+00
3293	1	5	293	設備	\N	2026-05-22 04:50:40.503898+00
3294	1	1	294	Penthouse mẫu — Tháp A	\N	2026-05-22 04:50:40.503898+00
3295	1	2	294	Showcase penthouse — Tower A	\N	2026-05-22 04:50:40.503898+00
3296	1	3	294	样板顶层公寓 — A塔	\N	2026-05-22 04:50:40.503898+00
3297	1	4	294	샘플 펜트하우스 — A동	\N	2026-05-22 04:50:40.503898+00
3298	1	5	294	モデルペントハウス — Aタワー	\N	2026-05-22 04:50:40.503898+00
3299	1	1	295	Căn 3PN duplex 142m² — tầng 41	\N	2026-05-22 04:50:40.503898+00
3300	1	2	295	3BR duplex 142m² — 41F	\N	2026-05-22 04:50:40.503898+00
3301	1	3	295	3卧复式 142㎡ — 41层	\N	2026-05-22 04:50:40.503898+00
3302	1	4	295	3BR 듀플렉스 142㎡ — 41층	\N	2026-05-22 04:50:40.503898+00
3303	1	5	295	3BRデュプレックス142㎡ — 41階	\N	2026-05-22 04:50:40.503898+00
3304	1	1	296	Căn hộ	\N	2026-05-22 04:50:40.503898+00
3305	1	2	296	Apartment	\N	2026-05-22 04:50:40.503898+00
3306	1	3	296	公寓	\N	2026-05-22 04:50:40.503898+00
3307	1	4	296	아파트	\N	2026-05-22 04:50:40.503898+00
3308	1	5	296	アパート	\N	2026-05-22 04:50:40.503898+00
3309	1	1	297	Phòng ngủ Master	\N	2026-05-22 04:50:40.503898+00
3310	1	2	297	Master Bedroom	\N	2026-05-22 04:50:40.503898+00
3311	1	3	297	主卧	\N	2026-05-22 04:50:40.503898+00
3312	1	4	297	마스터 베드룸	\N	2026-05-22 04:50:40.503898+00
3313	1	5	297	マスターベッドルーム	\N	2026-05-22 04:50:40.503898+00
3314	1	1	298	Suite riêng — 24m² + walk-in closet	\N	2026-05-22 04:50:40.503898+00
3315	1	2	298	Private suite — 24m² + walk-in closet	\N	2026-05-22 04:50:40.503898+00
3316	1	3	298	独立套间 — 24㎡ + 衣帽间	\N	2026-05-22 04:50:40.503898+00
3317	1	4	298	프라이빗 스위트 — 24㎡ + 워크인 클로젯	\N	2026-05-22 04:50:40.503898+00
3318	1	5	298	プライベートスイート — 24㎡ + ウォークインクローゼット	\N	2026-05-22 04:50:40.503898+00
3319	1	1	299	Bể bơi vô cực — Tầng 8	\N	2026-05-22 04:50:40.503898+00
3320	1	2	299	Infinity pool — 8F	\N	2026-05-22 04:50:40.503898+00
3321	1	3	299	无边泳池 — 8层	\N	2026-05-22 04:50:40.503898+00
3322	1	4	299	인피니티 풀 — 8층	\N	2026-05-22 04:50:40.503898+00
3323	1	5	299	インフィニティプール — 8階	\N	2026-05-22 04:50:40.503898+00
3324	1	1	300	50m × 25m, hệ nước muối thẩm thấu	\N	2026-05-22 04:50:40.503898+00
3325	1	2	300	50m × 25m, saltwater system	\N	2026-05-22 04:50:40.503898+00
3326	1	3	300	50m × 25m,盐水循环系统	\N	2026-05-22 04:50:40.503898+00
3327	1	4	300	50m × 25m, 염수 시스템	\N	2026-05-22 04:50:40.503898+00
3328	1	5	300	50m × 25m、塩水システム	\N	2026-05-22 04:50:40.503898+00
3329	1	1	301	Công viên trung tâm — 12.4ha	\N	2026-05-22 04:50:40.503898+00
3330	1	2	301	Central park — 12.4ha	\N	2026-05-22 04:50:40.503898+00
3331	1	3	301	中央公园 — 12.4公顷	\N	2026-05-22 04:50:40.503898+00
3332	1	4	301	센트럴 파크 — 12.4ha	\N	2026-05-22 04:50:40.503898+00
3333	1	5	301	セントラルパーク — 12.4ha	\N	2026-05-22 04:50:40.503898+00
3334	1	1	302	Vườn Nhật, hồ điều hòa, sân chạy 2.4km	\N	2026-05-22 04:50:40.503898+00
3335	1	2	302	Japanese garden, lake, 2.4km running track	\N	2026-05-22 04:50:40.503898+00
3336	1	3	302	日式庭院、调节湖、2.4公里跑道	\N	2026-05-22 04:50:40.503898+00
3337	1	4	302	일본 정원, 호수, 2.4km 러닝 트랙	\N	2026-05-22 04:50:40.503898+00
3338	1	5	302	日本庭園、調整池、2.4kmランニングトラック	\N	2026-05-22 04:50:40.503898+00
3339	1	1	303	Toàn cảnh dự án	\N	2026-05-22 04:50:40.503898+00
3340	1	2	303	Project panorama	\N	2026-05-22 04:50:40.503898+00
3341	1	3	303	项目全景	\N	2026-05-22 04:50:40.503898+00
3342	1	4	303	프로젝트 파노라마	\N	2026-05-22 04:50:40.503898+00
3343	1	5	303	プロジェクト全景	\N	2026-05-22 04:50:40.503898+00
3344	1	1	304	Phối cảnh tổng thể 6 tháp	\N	2026-05-22 04:50:40.503898+00
3345	1	2	304	Overall view — 6 towers	\N	2026-05-22 04:50:40.503898+00
3346	1	3	304	6座塔楼整体效果	\N	2026-05-22 04:50:40.503898+00
3347	1	4	304	6개 동 전체 조감	\N	2026-05-22 04:50:40.503898+00
3348	1	5	304	6棟全体パース	\N	2026-05-22 04:50:40.503898+00
3349	1	1	305	Tổng thể	\N	2026-05-22 04:50:40.503898+00
3350	1	2	305	Overall	\N	2026-05-22 04:50:40.503898+00
3351	1	3	305	整体	\N	2026-05-22 04:50:40.503898+00
3352	1	4	305	전체	\N	2026-05-22 04:50:40.503898+00
3353	1	5	305	全体	\N	2026-05-22 04:50:40.503898+00
3354	1	1	306	Vào penthouse mẫu	\N	2026-05-22 04:50:40.503898+00
3355	1	2	306	Enter showcase penthouse	\N	2026-05-22 04:50:40.503898+00
3356	1	3	306	进入样板顶层公寓	\N	2026-05-22 04:50:40.503898+00
3357	1	4	306	샘플 펜트하우스 진입	\N	2026-05-22 04:50:40.503898+00
3358	1	5	306	モデルペントハウスへ	\N	2026-05-22 04:50:40.503898+00
3359	1	1	307	Khu BBQ ngoài trời	\N	2026-05-22 04:50:40.503898+00
3360	1	2	307	Outdoor BBQ area	\N	2026-05-22 04:50:40.503898+00
3361	1	3	307	户外烧烤区	\N	2026-05-22 04:50:40.503898+00
3362	1	4	307	야외 BBQ 구역	\N	2026-05-22 04:50:40.503898+00
3363	1	5	307	屋外BBQエリア	\N	2026-05-22 04:50:40.503898+00
3364	1	1	308	Bể bơi tràn 50m hướng tây nhìn hoàng hôn hồ Tây.	\N	2026-05-22 04:50:40.503898+00
3365	1	2	308	50m infinity pool facing west — sunset over West Lake.	\N	2026-05-22 04:50:40.503898+00
3366	1	3	308	50米无边泳池朝西,可观赏西湖落日。	\N	2026-05-22 04:50:40.503898+00
3367	1	4	308	서쪽을 향한 50m 인피니티 풀 — 서호 일몰 전망.	\N	2026-05-22 04:50:40.503898+00
3368	1	5	308	西向きの50mインフィニティプール — タイ湖の夕日。	\N	2026-05-22 04:50:40.503898+00
3369	1	1	309	Khu BBQ 24 bàn riêng tư có mái che.	\N	2026-05-22 04:50:40.503898+00
3370	1	2	309	24 private BBQ tables under cover.	\N	2026-05-22 04:50:40.503898+00
3371	1	3	309	24张私密带顶棚烧烤桌。	\N	2026-05-22 04:50:40.503898+00
3372	1	4	309	지붕이 있는 24개의 프라이빗 BBQ 테이블.	\N	2026-05-22 04:50:40.503898+00
3373	1	5	309	屋根付きプライベートBBQテーブル24卓。	\N	2026-05-22 04:50:40.503898+00
3374	1	1	310	Phòng khách 38m²	\N	2026-05-22 04:50:40.503898+00
3375	1	2	310	Living room 38m²	\N	2026-05-22 04:50:40.503898+00
3376	1	3	310	客厅 38㎡	\N	2026-05-22 04:50:40.503898+00
3377	1	4	310	거실 38㎡	\N	2026-05-22 04:50:40.503898+00
3378	1	5	310	リビング38㎡	\N	2026-05-22 04:50:40.503898+00
3379	1	1	311	Sang phòng ngủ master	\N	2026-05-22 04:50:40.503898+00
3380	1	2	311	To master bedroom	\N	2026-05-22 04:50:40.503898+00
3381	1	3	311	前往主卧	\N	2026-05-22 04:50:40.503898+00
3382	1	4	311	마스터 베드룸으로	\N	2026-05-22 04:50:40.503898+00
3383	1	5	311	マスターベッドルームへ	\N	2026-05-22 04:50:40.503898+00
3384	1	1	312	Bếp đảo Bosch	\N	2026-05-22 04:50:40.503898+00
3385	1	2	312	Bosch island kitchen	\N	2026-05-22 04:50:40.503898+00
3386	1	3	312	Bosch 中岛厨房	\N	2026-05-22 04:50:40.503898+00
3387	1	4	312	보쉬 아일랜드 키친	\N	2026-05-22 04:50:40.503898+00
3388	1	5	312	Boschアイランドキッチン	\N	2026-05-22 04:50:40.503898+00
3389	1	1	313	Cửa kính từ trần đến sàn, view trực diện hồ Tây.	\N	2026-05-22 04:50:40.503898+00
3390	1	2	313	Floor-to-ceiling glass, direct West Lake view.	\N	2026-05-22 04:50:40.503898+00
3391	1	3	313	落地玻璃窗,正面西湖景。	\N	2026-05-22 04:50:40.503898+00
3392	1	4	313	바닥부터 천장까지 유리, 서호 정면 뷰.	\N	2026-05-22 04:50:40.503898+00
3393	1	5	313	床から天井までのガラス、タイ湖正面ビュー。	\N	2026-05-22 04:50:40.503898+00
3394	1	1	314	Trang bị full Bosch, đá Dekton, lò hấp & cảm ứng từ.	\N	2026-05-22 04:50:40.503898+00
3395	1	2	314	Full Bosch, Dekton stone, steam oven & induction.	\N	2026-05-22 04:50:40.503898+00
3396	1	3	314	全Bosch配置、Dekton石材、蒸箱与电磁炉。	\N	2026-05-22 04:50:40.503898+00
3397	1	4	314	보쉬 풀세트, 덱톤 스톤, 스팀 오븐 & 인덕션.	\N	2026-05-22 04:50:40.503898+00
3398	1	5	314	Boschフル装備、Dektonストーン、スチームオーブン&IH。	\N	2026-05-22 04:50:40.503898+00
3399	1	1	315	Tủ âm tường	\N	2026-05-22 04:50:40.503898+00
3400	1	2	315	Built-in wardrobe	\N	2026-05-22 04:50:40.503898+00
3401	1	3	315	嵌入式衣柜	\N	2026-05-22 04:50:40.503898+00
3402	1	4	315	빌트인 옷장	\N	2026-05-22 04:50:40.503898+00
3403	1	5	315	造作クローゼット	\N	2026-05-22 04:50:40.503898+00
3404	1	1	316	Cửa kính lùa toàn cảnh	\N	2026-05-22 04:50:40.503898+00
3405	1	2	316	Panoramic sliding glass	\N	2026-05-22 04:50:40.503898+00
3406	1	3	316	全景推拉玻璃门	\N	2026-05-22 04:50:40.503898+00
3407	1	4	316	파노라마 슬라이딩 도어	\N	2026-05-22 04:50:40.503898+00
3408	1	5	316	パノラマスライドガラス	\N	2026-05-22 04:50:40.503898+00
3409	1	1	317	Quay lại Sky Lounge	\N	2026-05-22 04:50:40.503898+00
3410	1	2	317	Back to Sky Lounge	\N	2026-05-22 04:50:40.503898+00
3411	1	3	317	返回空中酒廊	\N	2026-05-22 04:50:40.503898+00
3412	1	4	317	스카이 라운지로 복귀	\N	2026-05-22 04:50:40.503898+00
3413	1	5	317	スカイラウンジへ戻る	\N	2026-05-22 04:50:40.503898+00
3414	1	1	318	Tủ walk-in closet 6m² thiết kế riêng.	\N	2026-05-22 04:50:40.503898+00
3415	1	2	318	Custom 6m² walk-in closet.	\N	2026-05-22 04:50:40.503898+00
3416	1	3	318	定制6㎡步入式衣帽间。	\N	2026-05-22 04:50:40.503898+00
3417	1	4	318	맞춤 6㎡ 워크인 클로젯.	\N	2026-05-22 04:50:40.503898+00
3418	1	5	318	オーダーメイド6㎡ウォークインクローゼット。	\N	2026-05-22 04:50:40.503898+00
3419	1	1	319	Cửa kính cách âm Low-E 3 lớp.	\N	2026-05-22 04:50:40.503898+00
3420	1	2	319	Triple-pane Low-E soundproof glass.	\N	2026-05-22 04:50:40.503898+00
3421	1	3	319	三层Low-E隔音玻璃。	\N	2026-05-22 04:50:40.503898+00
3422	1	4	319	3중 Low-E 방음 유리.	\N	2026-05-22 04:50:40.503898+00
3423	1	5	319	3層Low-E防音ガラス。	\N	2026-05-22 04:50:40.503898+00
3424	1	1	320	Bể trẻ em	\N	2026-05-22 04:50:40.503898+00
3425	1	2	320	Kids' pool	\N	2026-05-22 04:50:40.503898+00
3426	1	3	320	儿童池	\N	2026-05-22 04:50:40.503898+00
3427	1	4	320	어린이 풀	\N	2026-05-22 04:50:40.503898+00
3428	1	5	320	子供プール	\N	2026-05-22 04:50:40.503898+00
3429	1	1	321	Cabana riêng tư	\N	2026-05-22 04:50:40.503898+00
3430	1	2	321	Private cabanas	\N	2026-05-22 04:50:40.503898+00
3431	1	3	321	私密凉亭	\N	2026-05-22 04:50:40.503898+00
3432	1	4	321	프라이빗 카바나	\N	2026-05-22 04:50:40.503898+00
3433	1	5	321	プライベートカバナ	\N	2026-05-22 04:50:40.503898+00
3434	1	1	322	Đi cảnh quan	\N	2026-05-22 04:50:40.503898+00
3435	1	2	322	Go to landscape	\N	2026-05-22 04:50:40.503898+00
3436	1	3	322	前往景观	\N	2026-05-22 04:50:40.503898+00
3437	1	4	322	조경 구역으로	\N	2026-05-22 04:50:40.503898+00
3438	1	5	322	ランドスケープへ	\N	2026-05-22 04:50:40.503898+00
3439	1	1	323	Bể nông 0.4m riêng biệt cho trẻ dưới 6 tuổi.	\N	2026-05-22 04:50:40.503898+00
3440	1	2	323	0.4m shallow pool for children under 6.	\N	2026-05-22 04:50:40.503898+00
3441	1	3	323	0.4米浅水区,适合6岁以下儿童。	\N	2026-05-22 04:50:40.503898+00
3442	1	4	323	6세 미만을 위한 0.4m 얕은 풀.	\N	2026-05-22 04:50:40.503898+00
3443	1	5	323	6歳未満向け0.4m浅瀬プール。	\N	2026-05-22 04:50:40.503898+00
3444	1	1	324	12 cabana có thể đặt riêng.	\N	2026-05-22 04:50:40.503898+00
3445	1	2	324	12 cabanas available for private booking.	\N	2026-05-22 04:50:40.503898+00
3446	1	3	324	12个凉亭可单独预订。	\N	2026-05-22 04:50:40.503898+00
3447	1	4	324	12개 카바나 개별 예약 가능.	\N	2026-05-22 04:50:40.503898+00
3448	1	5	324	12のカバナを個別予約可能。	\N	2026-05-22 04:50:40.503898+00
3449	1	1	325	Vườn thiền Zen	\N	2026-05-22 04:50:40.503898+00
3450	1	2	325	Zen garden	\N	2026-05-22 04:50:40.503898+00
3451	1	3	325	禅意花园	\N	2026-05-22 04:50:40.503898+00
3452	1	4	325	선 가든	\N	2026-05-22 04:50:40.503898+00
3453	1	5	325	禅庭園	\N	2026-05-22 04:50:40.503898+00
3454	1	1	326	Sân chạy bộ 2.4km	\N	2026-05-22 04:50:40.503898+00
3455	1	2	326	2.4km running track	\N	2026-05-22 04:50:40.503898+00
3456	1	3	326	2.4公里跑道	\N	2026-05-22 04:50:40.503898+00
3457	1	4	326	2.4km 러닝 트랙	\N	2026-05-22 04:50:40.503898+00
3458	1	5	326	2.4kmランニングトラック	\N	2026-05-22 04:50:40.503898+00
3459	1	1	327	Lên Sky Lounge	\N	2026-05-22 04:50:40.503898+00
3460	1	2	327	Up to Sky Lounge	\N	2026-05-22 04:50:40.503898+00
3461	1	3	327	上空中酒廊	\N	2026-05-22 04:50:40.503898+00
3462	1	4	327	스카이 라운지로 이동	\N	2026-05-22 04:50:40.503898+00
3463	1	5	327	スカイラウンジへ	\N	2026-05-22 04:50:40.503898+00
3464	1	1	328	Vườn đá Karesansui phong cách Kyoto.	\N	2026-05-22 04:50:40.503898+00
3465	1	2	328	Kyoto-style Karesansui rock garden.	\N	2026-05-22 04:50:40.503898+00
3466	1	3	328	京都风格枯山水石庭。	\N	2026-05-22 04:50:40.503898+00
3467	1	4	328	교토 스타일 카레산스이 정원.	\N	2026-05-22 04:50:40.503898+00
3468	1	5	328	京都様式の枯山水庭園。	\N	2026-05-22 04:50:40.503898+00
3469	1	1	329	Đường runway phủ EPDM giảm chấn.	\N	2026-05-22 04:50:40.503898+00
3470	1	2	329	EPDM shock-absorbing runway.	\N	2026-05-22 04:50:40.503898+00
3471	1	3	329	EPDM减震跑道。	\N	2026-05-22 04:50:40.503898+00
3472	1	4	329	EPDM 충격 흡수 트랙.	\N	2026-05-22 04:50:40.503898+00
3473	1	5	329	EPDMクッションランウェイ。	\N	2026-05-22 04:50:40.503898+00
3474	1	1	330	Tháp A — đang bán	\N	2026-05-22 04:50:40.503898+00
3475	1	2	330	Tower A — on sale	\N	2026-05-22 04:50:40.503898+00
3476	1	3	330	A塔 — 在售	\N	2026-05-22 04:50:40.503898+00
3477	1	4	330	A동 — 분양 중	\N	2026-05-22 04:50:40.503898+00
3478	1	5	330	Aタワー — 販売中	\N	2026-05-22 04:50:40.503898+00
3479	1	1	331	Tháp B & C	\N	2026-05-22 04:50:40.503898+00
3480	1	2	331	Towers B & C	\N	2026-05-22 04:50:40.503898+00
3481	1	3	331	B塔与C塔	\N	2026-05-22 04:50:40.503898+00
3482	1	4	331	B 및 C동	\N	2026-05-22 04:50:40.503898+00
3483	1	5	331	BタワーとCタワー	\N	2026-05-22 04:50:40.503898+00
3484	1	1	332	Giai đoạn 1 — đã bàn giao 2026.	\N	2026-05-22 04:50:40.503898+00
3485	1	2	332	Phase 1 — handed over in 2026.	\N	2026-05-22 04:50:40.503898+00
3486	1	3	332	第一期 — 2026年已交付。	\N	2026-05-22 04:50:40.503898+00
3487	1	4	332	1단계 — 2026년 인도 완료.	\N	2026-05-22 04:50:40.503898+00
3488	1	5	332	第1期 — 2026年引き渡し済み。	\N	2026-05-22 04:50:40.503898+00
3489	1	1	333	2PN	\N	2026-05-22 04:50:40.503898+00
3490	1	2	333	2BR	\N	2026-05-22 04:50:40.503898+00
3491	1	3	333	2卧	\N	2026-05-22 04:50:40.503898+00
3492	1	4	333	2BR	\N	2026-05-22 04:50:40.503898+00
3493	1	5	333	2BR	\N	2026-05-22 04:50:40.503898+00
3494	1	1	334	2PN+1	\N	2026-05-22 04:50:40.503898+00
3495	1	2	334	2BR +1	\N	2026-05-22 04:50:40.503898+00
3496	1	3	334	2卧+1	\N	2026-05-22 04:50:40.503898+00
3497	1	4	334	2BR +1	\N	2026-05-22 04:50:40.503898+00
3498	1	5	334	2BR +1	\N	2026-05-22 04:50:40.503898+00
3499	1	1	335	3PN	\N	2026-05-22 04:50:40.503898+00
3500	1	2	335	3BR	\N	2026-05-22 04:50:40.503898+00
3501	1	3	335	3卧	\N	2026-05-22 04:50:40.503898+00
3502	1	4	335	3BR	\N	2026-05-22 04:50:40.503898+00
3503	1	5	335	3BR	\N	2026-05-22 04:50:40.503898+00
3504	1	1	336	Duplex 3PN	\N	2026-05-22 04:50:40.503898+00
3505	1	2	336	Duplex 3BR	\N	2026-05-22 04:50:40.503898+00
3506	1	3	336	复式3卧	\N	2026-05-22 04:50:40.503898+00
3507	1	4	336	듀플렉스 3BR	\N	2026-05-22 04:50:40.503898+00
3508	1	5	336	デュプレックス3BR	\N	2026-05-22 04:50:40.503898+00
3509	1	1	337	5.4 tỷ	\N	2026-05-22 04:50:40.503898+00
3510	1	2	337	5.4B VND	\N	2026-05-22 04:50:40.503898+00
3511	1	3	337	54亿越南盾	\N	2026-05-22 04:50:40.503898+00
3512	1	4	337	54억 VND	\N	2026-05-22 04:50:40.503898+00
3513	1	5	337	54億VND	\N	2026-05-22 04:50:40.503898+00
3514	1	1	338	6.8 tỷ	\N	2026-05-22 04:50:40.503898+00
3515	1	2	338	6.8B VND	\N	2026-05-22 04:50:40.503898+00
3516	1	3	338	68亿越南盾	\N	2026-05-22 04:50:40.503898+00
3517	1	4	338	68억 VND	\N	2026-05-22 04:50:40.503898+00
3518	1	5	338	68億VND	\N	2026-05-22 04:50:40.503898+00
3519	1	1	339	8.9 tỷ	\N	2026-05-22 04:50:40.503898+00
3520	1	2	339	8.9B VND	\N	2026-05-22 04:50:40.503898+00
3521	1	3	339	89亿越南盾	\N	2026-05-22 04:50:40.503898+00
3522	1	4	339	89억 VND	\N	2026-05-22 04:50:40.503898+00
3523	1	5	339	89億VND	\N	2026-05-22 04:50:40.503898+00
3524	1	1	340	14.2 tỷ	\N	2026-05-22 04:50:40.503898+00
3525	1	2	340	14.2B VND	\N	2026-05-22 04:50:40.503898+00
3526	1	3	340	142亿越南盾	\N	2026-05-22 04:50:40.503898+00
3527	1	4	340	142억 VND	\N	2026-05-22 04:50:40.503898+00
3528	1	5	340	142億VND	\N	2026-05-22 04:50:40.503898+00
3529	1	1	341	4.9 tỷ	\N	2026-05-22 04:50:40.503898+00
3530	1	2	341	4.9B VND	\N	2026-05-22 04:50:40.503898+00
3531	1	3	341	49亿越南盾	\N	2026-05-22 04:50:40.503898+00
3532	1	4	341	49억 VND	\N	2026-05-22 04:50:40.503898+00
3533	1	5	341	49億VND	\N	2026-05-22 04:50:40.503898+00
3534	1	1	342	Khởi công	\N	2026-05-22 04:50:40.503898+00
3535	1	2	342	Groundbreaking	\N	2026-05-22 04:50:40.503898+00
3536	1	3	342	动工	\N	2026-05-22 04:50:40.503898+00
3537	1	4	342	착공	\N	2026-05-22 04:50:40.503898+00
3538	1	5	342	着工	\N	2026-05-22 04:50:40.503898+00
3539	1	1	343	Cất nóc tháp A & B	\N	2026-05-22 04:50:40.503898+00
3540	1	2	343	Topping out Towers A & B	\N	2026-05-22 04:50:40.503898+00
3541	1	3	343	A塔与B塔封顶	\N	2026-05-22 04:50:40.503898+00
3542	1	4	343	A 및 B동 상량	\N	2026-05-22 04:50:40.503898+00
3543	1	5	343	A・Bタワー上棟	\N	2026-05-22 04:50:40.503898+00
3544	1	1	344	Mở bán GĐ 2	\N	2026-05-22 04:50:40.503898+00
3545	1	2	344	Phase 2 launch	\N	2026-05-22 04:50:40.503898+00
3546	1	3	344	第二期开盘	\N	2026-05-22 04:50:40.503898+00
3547	1	4	344	2단계 분양	\N	2026-05-22 04:50:40.503898+00
3548	1	5	344	第2期販売	\N	2026-05-22 04:50:40.503898+00
3549	1	1	345	Hoàn thiện ngoại thất	\N	2026-05-22 04:50:40.503898+00
3550	1	2	345	Façade completion	\N	2026-05-22 04:50:40.503898+00
3551	1	3	345	外立面完工	\N	2026-05-22 04:50:40.503898+00
3552	1	4	345	외장 마감	\N	2026-05-22 04:50:40.503898+00
3553	1	5	345	外装完成	\N	2026-05-22 04:50:40.503898+00
3554	1	1	346	Bàn giao tháp A	\N	2026-05-22 04:50:40.503898+00
3555	1	2	346	Tower A handover	\N	2026-05-22 04:50:40.503898+00
3556	1	3	346	A塔交付	\N	2026-05-22 04:50:40.503898+00
3557	1	4	346	A동 인도	\N	2026-05-22 04:50:40.503898+00
3558	1	5	346	Aタワー引き渡し	\N	2026-05-22 04:50:40.503898+00
3559	1	1	347	Q1 / 2024	\N	2026-05-22 04:50:40.503898+00
3560	1	2	347	Q1 / 2024	\N	2026-05-22 04:50:40.503898+00
3561	1	3	347	2024年Q1	\N	2026-05-22 04:50:40.503898+00
3562	1	4	347	2024년 1분기	\N	2026-05-22 04:50:40.503898+00
3563	1	5	347	2024年Q1	\N	2026-05-22 04:50:40.503898+00
3564	1	1	348	Q2 / 2026	\N	2026-05-22 04:50:40.503898+00
3565	1	2	348	Q2 / 2026	\N	2026-05-22 04:50:40.503898+00
3566	1	3	348	2026年Q2	\N	2026-05-22 04:50:40.503898+00
3567	1	4	348	2026년 2분기	\N	2026-05-22 04:50:40.503898+00
3568	1	5	348	2026年Q2	\N	2026-05-22 04:50:40.503898+00
3569	1	1	349	Q1 / 2027	\N	2026-05-22 04:50:40.503898+00
3570	1	2	349	Q1 / 2027	\N	2026-05-22 04:50:40.503898+00
3571	1	3	349	2027年Q1	\N	2026-05-22 04:50:40.503898+00
3572	1	4	349	2027년 1분기	\N	2026-05-22 04:50:40.503898+00
3573	1	5	349	2027年Q1	\N	2026-05-22 04:50:40.503898+00
3574	1	1	350	Q4 / 2027	\N	2026-05-22 04:50:40.503898+00
3575	1	2	350	Q4 / 2027	\N	2026-05-22 04:50:40.503898+00
3576	1	3	350	2027年Q4	\N	2026-05-22 04:50:40.503898+00
3577	1	4	350	2027년 4분기	\N	2026-05-22 04:50:40.503898+00
3578	1	5	350	2027年Q4	\N	2026-05-22 04:50:40.503898+00
3579	1	1	351	dự án Vinhomes Hai Van Bay ngay lúc này	\N	2026-05-22 04:50:40.503898+00
3580	1	2	351	Vinhomes Hai Van Bay right now	\N	2026-05-22 04:50:40.503898+00
3581	1	3	351	Vinhomes Hai Van Bay 项目正在热销	\N	2026-05-22 04:50:40.503898+00
3582	1	4	351	Vinhomes Hai Van Bay 현재	\N	2026-05-22 04:50:40.503898+00
3583	1	5	351	Vinhomes Hai Van Bay プロジェクトで今	\N	2026-05-22 04:50:40.503898+00
3584	1	1	352	18 người đang xem	\N	2026-05-22 04:50:40.503898+00
3585	1	2	352	18 people viewing	\N	2026-05-22 04:50:40.503898+00
3586	1	3	352	18人正在浏览	\N	2026-05-22 04:50:40.503898+00
3587	1	4	352	18명이 보는 중	\N	2026-05-22 04:50:40.503898+00
3588	1	5	352	18人が閲覧中	\N	2026-05-22 04:50:40.503898+00
3589	1	1	353	24 người đang xem	\N	2026-05-22 04:50:40.503898+00
3590	1	2	353	24 people viewing	\N	2026-05-22 04:50:40.503898+00
3591	1	3	353	24人正在浏览	\N	2026-05-22 04:50:40.503898+00
3592	1	4	353	24명이 보는 중	\N	2026-05-22 04:50:40.503898+00
3593	1	5	353	24人が閲覧中	\N	2026-05-22 04:50:40.503898+00
3594	1	1	354	31 người đang xem	\N	2026-05-22 04:50:40.503898+00
3595	1	2	354	31 people viewing	\N	2026-05-22 04:50:40.503898+00
3596	1	3	354	31人正在浏览	\N	2026-05-22 04:50:40.503898+00
3597	1	4	354	31명이 보는 중	\N	2026-05-22 04:50:40.503898+00
3598	1	5	354	31人が閲覧中	\N	2026-05-22 04:50:40.503898+00
3599	1	1	355	Vừa đặt giữ 2PN+1 tầng 22	\N	2026-05-22 04:50:40.503898+00
3600	1	2	355	Just reserved 2BR+1 on floor 22	\N	2026-05-22 04:50:40.503898+00
3601	1	3	355	刚预订了22层2卧+1	\N	2026-05-22 04:50:40.503898+00
3602	1	4	355	22층 2BR+1 방금 예약됨	\N	2026-05-22 04:50:40.503898+00
3603	1	5	355	22階2BR+1を予約済み	\N	2026-05-22 04:50:40.503898+00
3604	1	1	356	3 phút trước · Khách Hà Nội	\N	2026-05-22 04:50:40.503898+00
3605	1	2	356	3 min ago · Hanoi buyer	\N	2026-05-22 04:50:40.503898+00
3606	1	3	356	3分钟前 · 河内买家	\N	2026-05-22 04:50:40.503898+00
3607	1	4	356	3분 전 · 하노이 고객	\N	2026-05-22 04:50:40.503898+00
3608	1	5	356	3分前 · ハノイのお客様	\N	2026-05-22 04:50:40.503898+00
3609	1	1	357	Vừa đặt giữ Duplex tầng 40	\N	2026-05-22 04:50:40.503898+00
3610	1	2	357	Just reserved Duplex on floor 40	\N	2026-05-22 04:50:40.503898+00
3611	1	3	357	刚预订了40层复式	\N	2026-05-22 04:50:40.503898+00
3612	1	4	357	40층 Duplex 방금 예약됨	\N	2026-05-22 04:50:40.503898+00
3613	1	5	357	40階デュプレックスを予約済み	\N	2026-05-22 04:50:40.503898+00
3614	1	1	358	12 phút trước · Khách TP.HCM	\N	2026-05-22 04:50:40.503898+00
3615	1	2	358	12 min ago · HCM City buyer	\N	2026-05-22 04:50:40.503898+00
3616	1	3	358	12分钟前 · 胡志明市买家	\N	2026-05-22 04:50:40.503898+00
3617	1	4	358	12분 전 · 호치민 고객	\N	2026-05-22 04:50:40.503898+00
3618	1	5	358	12分前 · ホーチミン市のお客様	\N	2026-05-22 04:50:40.503898+00
3619	1	1	359	Còn 49 căn trong đợt này	\N	2026-05-22 04:50:40.503898+00
3620	1	2	359	49 units remaining this phase	\N	2026-05-22 04:50:40.503898+00
3621	1	3	359	本期还剩49套	\N	2026-05-22 04:50:40.503898+00
3622	1	4	359	이번 분양 49세대 남음	\N	2026-05-22 04:50:40.503898+00
3623	1	5	359	今期残り49戸	\N	2026-05-22 04:50:40.503898+00
3624	1	1	360	Ưu đãi 8% kết thúc sớm	\N	2026-05-22 04:50:40.503898+00
3625	1	2	360	8% discount ending soon	\N	2026-05-22 04:50:40.503898+00
3626	1	3	360	8%折扣即将结束	\N	2026-05-22 04:50:40.503898+00
3627	1	4	360	8% 할인 곧 종료	\N	2026-05-22 04:50:40.503898+00
3628	1	5	360	8%割引もうすぐ終了	\N	2026-05-22 04:50:40.503898+00
3629	1	1	361	Vừa đặt giữ 3PN tầng 35	\N	2026-05-22 04:50:40.503898+00
3630	1	2	361	Just reserved 3BR on floor 35	\N	2026-05-22 04:50:40.503898+00
3631	1	3	361	刚预订了35层3卧	\N	2026-05-22 04:50:40.503898+00
3632	1	4	361	35층 3BR 방금 예약됨	\N	2026-05-22 04:50:40.503898+00
3633	1	5	361	35階3BRを予約済み	\N	2026-05-22 04:50:40.503898+00
3634	1	1	362	7 phút trước · Khách nước ngoài	\N	2026-05-22 04:50:40.503898+00
3635	1	2	362	7 min ago · International buyer	\N	2026-05-22 04:50:40.503898+00
3636	1	3	362	7分钟前 · 海外买家	\N	2026-05-22 04:50:40.503898+00
3637	1	4	362	7분 전 · 해외 고객	\N	2026-05-22 04:50:40.503898+00
3638	1	5	362	7分前 · 海外のお客様	\N	2026-05-22 04:50:40.503898+00
3639	1	1	363	Căn 3PN tầng 28 vừa giữ	\N	2026-05-22 04:50:40.503898+00
3640	1	2	363	3BR on floor 28 just reserved	\N	2026-05-22 04:50:40.503898+00
3641	1	3	363	28层3卧刚被预订	\N	2026-05-22 04:50:40.503898+00
3642	1	4	363	28층 3BR 방금 예약됨	\N	2026-05-22 04:50:40.503898+00
3643	1	5	363	28階3BRが予約済み	\N	2026-05-22 04:50:40.503898+00
3644	1	1	364	Chỉ còn 9 căn 3PN	\N	2026-05-22 04:50:40.503898+00
3645	1	2	364	Only 9 units of 3BR left	\N	2026-05-22 04:50:40.503898+00
3646	1	3	364	3卧仅剩9套	\N	2026-05-22 04:50:40.503898+00
3647	1	4	364	3BR 9세대만 남음	\N	2026-05-22 04:50:40.503898+00
3648	1	5	364	3BR残り9戸のみ	\N	2026-05-22 04:50:40.503898+00
\.


--
-- TOC entry 4359 (class 0 OID 24698)
-- Dependencies: 231
-- Data for Name: project_versions; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.project_versions (id, project_id, version_no, version_type, snapshot_json, note, created_by_user_id, created_at, published_at) FROM stdin;
\.


--
-- TOC entry 4355 (class 0 OID 24655)
-- Dependencies: 227
-- Data for Name: projects; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.projects (id, code, name, tagline, location_text, developer_name, sales_status, handover_text, price_from_text, price_unit_text, price_from_vnd, area_range_text, total_units, total_towers, floors_text, density_pct, green_space_text, green_space_ha, units_left, total_units_for_sale, promo_deadline_at, timezone_name, logo_url, favicon_url, cover_image_url, is_active, created_at, updated_at) FROM stdin;
1	haivanbay	Vinhomes Hai Van Bay	Sống trên tầng mây — Đô thị sinh thái cao cấp	Làng Vân, Hải Vân, Đà Nẵng	Vinhomes	Đang mở bán giai đoạn 2	Quý IV / 2027	Từ 4.9 tỷ	VND / căn	4900000000.00	58 — 142 m²	1840	6	42 tầng	27.00	12.4 ha công viên nội khu	\N	49	312	2025-07-31 23:59:59+00	Asia/Ho_Chi_Minh	\N	\N	\N	t	2026-05-22 03:37:47.261563+00	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4444 (class 0 OID 25478)
-- Dependencies: 316
-- Data for Name: properties; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.properties (id, project_id, tower_id, floor_id, property_type_id, scene_id, sales_user_id, property_code, name, subdivision_code, subdivision_label, type_code, type_label, description, area_sqm, bedroom_count, bathroom_count, floor_number, facing_direction, price_vnd, price_display, price_per_sqm_vnd, price_per_sqm_display, available_count, total_count, legal_text, handover_text, status_code, status_label, sort_order, is_active, metadata, created_at, updated_at) FROM stdin;
55	1	\N	\N	\N	\N	\N	HV5-12.08	Căn hộ Hải Vân 5	pk-vinh-may	Vịnh Mây	can-ho	Căn hộ	Căn hộ 2 phòng ngủ tầm nhìn vịnh, thiết kế tối ưu công năng, ban công rộng đón gió biển.	72.00	2	2	\N	Đông Nam	5400000000.00	5.400.000.000	\N	75.000.000	\N	\N	Sổ đỏ lâu dài	Quý IV/2026	available	Đang mở bán	0	t	{"slug": "HV5-12-08", "priceVal": 5.4, "thumbsFloor": ["img/1.png", "img/2.png", "img/1.png", "img/2.png"], "consultEmail": "tuvanduan@haivanbay.vn", "consultPhone": "1900 1234"}	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
56	1	\N	\N	\N	\N	\N	VM-SH-06.03	Shophouse Vịnh Mây	pk-vinh-may	Vịnh Mây	shophouse	Shophouse	Shophouse mặt phố thương mại, kết cấu 4 tầng, vừa ở vừa kinh doanh, vị trí trục chính sầm uất.	120.00	4	5	\N	Tây Nam	15600000000.00	15.600.000.000	\N	130.000.000	\N	\N	Sổ đỏ lâu dài	Quý IV/2026	available	Đang mở bán	1	t	{"slug": "VM-SH-06-03", "priceVal": 15.6, "thumbsFloor": ["img/1.png", "img/2.png", "img/1.png", "img/2.png"], "consultEmail": "tuvanduan@haivanbay.vn", "consultPhone": "1900 1234"}	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
57	1	\N	\N	\N	\N	\N	BV-BT-02.11	Biệt thự Bạch Vân	pk-bach-van	Bạch Vân	biet-thu	Biệt thự	Biệt thự đơn lập sân vườn rộng, hồ bơi riêng, không gian sống đẳng cấp gần công viên trung tâm.	300.00	5	6	\N	Đông	28500000000.00	28.500.000.000	\N	95.000.000	\N	\N	Sổ đỏ lâu dài	Quý II/2027	holding	Đang giữ chỗ	2	t	{"slug": "BV-BT-02-11", "priceVal": 28.5, "thumbsFloor": ["img/1.png", "img/2.png", "img/1.png", "img/2.png"], "consultEmail": "tuvanduan@haivanbay.vn", "consultPhone": "1900 1234"}	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
58	1	\N	\N	\N	\N	\N	DN-BT-01.05	Biệt thự đảo Đảo Ngọc	pk-dao-ngoc	Đảo Ngọc	biet-thu	Biệt thự	Biệt thự đảo compound khép kín, bến du thuyền riêng, an ninh tuyệt đối cho cộng đồng tinh hoa.	350.00	5	6	\N	Nam	42000000000.00	42.000.000.000	\N	120.000.000	\N	\N	Sổ đỏ lâu dài	Quý III/2027	available	Đang mở bán	3	t	{"slug": "DN-BT-01-05", "priceVal": 42, "thumbsFloor": ["img/1.png", "img/2.png", "img/1.png", "img/2.png"], "consultEmail": "tuvanduan@haivanbay.vn", "consultPhone": "1900 1234"}	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
59	1	\N	\N	\N	\N	\N	TV-CH-09.21	Căn hộ Tịnh Vân	pk-tinh-van	Tịnh Vân	can-ho	Căn hộ	Căn hộ 1 phòng ngủ trung tâm thương mại, phù hợp đầu tư cho thuê, thanh khoản cao.	58.00	1	1	\N	Bắc	3900000000.00	3.900.000.000	\N	68.000.000	\N	\N	Sổ đỏ lâu dài	Quý IV/2026	available	Đang mở bán	4	t	{"slug": "TV-CH-09-21", "priceVal": 3.9, "thumbsFloor": ["img/1.png", "img/2.png", "img/1.png", "img/2.png"], "consultEmail": "tuvanduan@haivanbay.vn", "consultPhone": "1900 1234"}	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
60	1	\N	\N	\N	\N	\N	TV-NP-03.14	Nhà phố Tịnh Vân	pk-tinh-van	Tịnh Vân	nha-pho	Nhà phố	Nhà phố liền kề khu dân cư hiện hữu, hạ tầng hoàn thiện, môi trường sống xanh.	100.00	3	4	\N	Đông Bắc	11200000000.00	11.200.000.000	\N	112.000.000	\N	\N	Sổ đỏ lâu dài	Quý IV/2026	sold	Đã bán	5	t	{"slug": "TV-NP-03-14", "priceVal": 11.2, "thumbsFloor": ["img/1.png", "img/2.png", "img/1.png", "img/2.png"], "consultEmail": "tuvanduan@haivanbay.vn", "consultPhone": "1900 1234"}	2026-05-22 04:38:53.903655+00	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4454 (class 0 OID 25581)
-- Dependencies: 326
-- Data for Name: property_documents; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_documents (id, property_id, document_name, document_type, document_url, sort_order) FROM stdin;
163	55	Brochure dự án	PDF	\N	0
164	55	Bảng giá chi tiết	PDF	\N	1
165	55	Hợp đồng mẫu	PDF	\N	2
166	56	Brochure dự án	PDF	\N	0
167	56	Bảng giá chi tiết	PDF	\N	1
168	56	Hợp đồng mẫu	PDF	\N	2
169	57	Brochure dự án	PDF	\N	0
170	57	Bảng giá chi tiết	PDF	\N	1
171	57	Hợp đồng mẫu	PDF	\N	2
172	58	Brochure dự án	PDF	\N	0
173	58	Bảng giá chi tiết	PDF	\N	1
174	58	Hợp đồng mẫu	PDF	\N	2
175	59	Brochure dự án	PDF	\N	0
176	59	Bảng giá chi tiết	PDF	\N	1
177	59	Hợp đồng mẫu	PDF	\N	2
178	60	Brochure dự án	PDF	\N	0
179	60	Bảng giá chi tiết	PDF	\N	1
180	60	Hợp đồng mẫu	PDF	\N	2
\.


--
-- TOC entry 4448 (class 0 OID 25539)
-- Dependencies: 320
-- Data for Name: property_floor_plans; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_floor_plans (id, property_id, image_url, label, sort_order) FROM stdin;
217	55	img/1.png	\N	0
218	55	img/2.png	\N	1
219	55	img/1.png	\N	2
220	55	img/2.png	\N	3
221	56	img/1.png	\N	0
222	56	img/2.png	\N	1
223	56	img/1.png	\N	2
224	56	img/2.png	\N	3
225	57	img/1.png	\N	0
226	57	img/2.png	\N	1
227	57	img/1.png	\N	2
228	57	img/2.png	\N	3
229	58	img/1.png	\N	0
230	58	img/2.png	\N	1
231	58	img/1.png	\N	2
232	58	img/2.png	\N	3
233	59	img/1.png	\N	0
234	59	img/2.png	\N	1
235	59	img/1.png	\N	2
236	59	img/2.png	\N	3
237	60	img/1.png	\N	0
238	60	img/2.png	\N	1
239	60	img/1.png	\N	2
240	60	img/2.png	\N	3
\.


--
-- TOC entry 4450 (class 0 OID 25553)
-- Dependencies: 322
-- Data for Name: property_highlights; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_highlights (id, property_id, highlight_text, sort_order) FROM stdin;
163	55	View trực diện vịnh biển	0
164	55	Bàn giao nội thất cơ bản	1
165	55	Tầng trung tầm nhìn đẹp	2
166	56	Mặt tiền phố thương mại	0
167	56	Kết cấu 4 tầng linh hoạt	1
168	56	Vừa ở vừa kinh doanh	2
169	57	Sân vườn & hồ bơi riêng	0
170	57	Biệt thự đơn lập 3 mặt thoáng	1
171	57	Gần công viên trung tâm	2
172	58	Bến du thuyền riêng	0
173	58	Compound an ninh 3 lớp	1
174	58	Tầm nhìn biển trọn vẹn	2
175	59	Trung tâm thương mại sầm uất	0
176	59	Phù hợp đầu tư cho thuê	1
177	59	Bàn giao sớm	2
178	60	Hạ tầng hoàn thiện	0
179	60	Khu dân cư hiện hữu	1
180	60	Gần trường học	2
\.


--
-- TOC entry 4446 (class 0 OID 25525)
-- Dependencies: 318
-- Data for Name: property_images; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_images (id, property_id, image_url, sort_order) FROM stdin;
163	55	img/2.png	0
164	55	img/1.png	1
165	55	img/2.png	2
166	56	img/2.png	0
167	56	img/1.png	1
168	56	img/2.png	2
169	57	img/2.png	0
170	57	img/1.png	1
171	57	img/2.png	2
172	58	img/2.png	0
173	58	img/1.png	1
174	58	img/2.png	2
175	59	img/2.png	0
176	59	img/1.png	1
177	59	img/2.png	2
178	60	img/2.png	0
179	60	img/1.png	1
180	60	img/2.png	2
\.


--
-- TOC entry 4456 (class 0 OID 25596)
-- Dependencies: 328
-- Data for Name: property_milestones; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_milestones (id, property_id, phase_name, phase_date_text, is_done, sort_order) FROM stdin;
217	55	Khởi công	Q1/2024	t	0
218	55	Hoàn thiện móng	Q3/2024	t	1
219	55	Xây thô	Q2/2025	f	2
220	55	Bàn giao	Q4/2026	f	3
221	56	Khởi công	Q1/2024	t	0
222	56	Hoàn thiện móng	Q3/2024	t	1
223	56	Xây thô	Q2/2025	f	2
224	56	Bàn giao	Q4/2026	f	3
225	57	Khởi công	Q1/2024	t	0
226	57	Hoàn thiện móng	Q3/2024	t	1
227	57	Xây thô	Q2/2025	f	2
228	57	Bàn giao	Q4/2026	f	3
229	58	Khởi công	Q1/2024	t	0
230	58	Hoàn thiện móng	Q3/2024	t	1
231	58	Xây thô	Q2/2025	f	2
232	58	Bàn giao	Q4/2026	f	3
233	59	Khởi công	Q1/2024	t	0
234	59	Hoàn thiện móng	Q3/2024	t	1
235	59	Xây thô	Q2/2025	f	2
236	59	Bàn giao	Q4/2026	f	3
237	60	Khởi công	Q1/2024	t	0
238	60	Hoàn thiện móng	Q3/2024	t	1
239	60	Xây thô	Q2/2025	f	2
240	60	Bàn giao	Q4/2026	f	3
\.


--
-- TOC entry 4452 (class 0 OID 25567)
-- Dependencies: 324
-- Data for Name: property_policies; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_policies (id, property_id, policy_text, sort_order) FROM stdin;
217	55	Chiết khấu 8% thanh toán sớm	0
218	55	Hỗ trợ lãi suất 0% trong 18 tháng	1
219	55	Cam kết mua lại 7%/năm	2
220	55	Tặng gói nội thất cao cấp	3
221	56	Chiết khấu 8% thanh toán sớm	0
222	56	Hỗ trợ lãi suất 0% trong 18 tháng	1
223	56	Cam kết mua lại 7%/năm	2
224	56	Tặng gói nội thất cao cấp	3
225	57	Chiết khấu 8% thanh toán sớm	0
226	57	Hỗ trợ lãi suất 0% trong 18 tháng	1
227	57	Cam kết mua lại 7%/năm	2
228	57	Tặng gói nội thất cao cấp	3
229	58	Chiết khấu 8% thanh toán sớm	0
230	58	Hỗ trợ lãi suất 0% trong 18 tháng	1
231	58	Cam kết mua lại 7%/năm	2
232	58	Tặng gói nội thất cao cấp	3
233	59	Chiết khấu 8% thanh toán sớm	0
234	59	Hỗ trợ lãi suất 0% trong 18 tháng	1
235	59	Cam kết mua lại 7%/năm	2
236	59	Tặng gói nội thất cao cấp	3
237	60	Chiết khấu 8% thanh toán sớm	0
238	60	Hỗ trợ lãi suất 0% trong 18 tháng	1
239	60	Cam kết mua lại 7%/năm	2
240	60	Tặng gói nội thất cao cấp	3
\.


--
-- TOC entry 4460 (class 0 OID 25628)
-- Dependencies: 332
-- Data for Name: property_price_history; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_price_history (id, property_id, price_vnd, price_per_sqm_vnd, effective_from, effective_to, changed_by_user_id, note) FROM stdin;
\.


--
-- TOC entry 4478 (class 0 OID 25842)
-- Dependencies: 350
-- Data for Name: property_reservations; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_reservations (id, project_id, property_id, lead_id, customer_id, sales_user_id, reservation_type, status_code, hold_started_at, hold_expires_at, deposit_amount_vnd, payment_method, payment_reference, notes, created_at, updated_at) FROM stdin;
4	1	55	10	13	1	hold	holding	\N	\N	\N	\N	\N	\N	2026-05-22 04:30:54.283+00	2026-05-22 04:38:53.903655+00
\.


--
-- TOC entry 4458 (class 0 OID 25609)
-- Dependencies: 330
-- Data for Name: property_status_history; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_status_history (id, property_id, old_status_code, new_status_code, changed_by_user_id, change_reason, changed_at) FROM stdin;
4	56	available	reserved	1	\N	2026-05-22 01:38:54.284+00
\.


--
-- TOC entry 4442 (class 0 OID 25463)
-- Dependencies: 314
-- Data for Name: property_types; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.property_types (id, project_id, type_code, type_name, bedroom_count, extra_room_count, unit_class, area_from_sqm, area_to_sqm, is_active) FROM stdin;
1	1	3pn	Căn 3 phòng ngủ	3	0	\N	\N	\N	t
\.


--
-- TOC entry 4414 (class 0 OID 25246)
-- Dependencies: 286
-- Data for Name: resource_categories; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.resource_categories (id, project_id, code, name, sort_order) FROM stdin;
\.


--
-- TOC entry 4345 (class 0 OID 24580)
-- Dependencies: 217
-- Data for Name: roles; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.roles (id, code, name, description, created_at) FROM stdin;
1	owner	Owner	Full project control	2026-05-22 03:37:27.636612+00
3	sales	Sales	Sales consultant	2026-05-22 03:37:27.636612+00
5	developer	Developer	Technical operator	2026-05-22 03:37:27.636612+00
\.


--
-- TOC entry 4466 (class 0 OID 25674)
-- Dependencies: 338
-- Data for Name: sales_public_links; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.sales_public_links (id, project_id, user_id, slug, destination_url, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 4398 (class 0 OID 25085)
-- Dependencies: 270
-- Data for Name: site_map_points; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.site_map_points (id, site_map_id, panorama_id, scene_id, point_code, label, x_pct, y_pct, sort_order, is_active, metadata) FROM stdin;
64	10	\N	\N	i1	Tòa The Lake Premium (I1)	0.00	0.00	0	t	{"lat": 16.2155, "lng": 108.118, "tdvPanoramaId": "pano-01"}
65	10	\N	\N	i2	Tòa The Park (I2)	0.00	0.00	1	t	{"lat": 16.2145, "lng": 108.121, "tdvPanoramaId": "pano-05"}
66	10	\N	\N	i3	Tòa The Central (I3)	0.00	0.00	2	t	{"lat": 16.2135, "lng": 108.123, "tdvPanoramaId": "pano-10"}
67	10	\N	\N	i4	Tòa Nguyệt Quế (I4)	0.00	0.00	3	t	{"lat": 16.212, "lng": 108.1195, "tdvPanoramaId": "pano-15"}
68	10	\N	\N	i5	Tòa Thảo Mộc (I5)	0.00	0.00	4	t	{"lat": 16.211, "lng": 108.122, "tdvPanoramaId": "pano-20"}
69	10	\N	\N	park	Công viên trung tâm	0.00	0.00	5	t	{"lat": 16.214, "lng": 108.116, "tdvPanoramaId": "pano-08"}
70	10	\N	\N	pool	Bể bơi vô cực	0.00	0.00	6	t	{"lat": 16.2125, "lng": 108.1245, "tdvPanoramaId": "pano-13"}
\.


--
-- TOC entry 4396 (class 0 OID 25070)
-- Dependencies: 268
-- Data for Name: site_maps; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.site_maps (id, project_id, name, background_url, is_default, sort_order) FROM stdin;
10	1	Site map chính		t	0
\.


--
-- TOC entry 4373 (class 0 OID 24834)
-- Dependencies: 245
-- Data for Name: theme_presets; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.theme_presets (id, project_id, preset_name, tokens_json, is_system, is_active, created_by_user_id, created_at) FROM stdin;
\.


--
-- TOC entry 4438 (class 0 OID 25435)
-- Dependencies: 310
-- Data for Name: towers; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.towers (id, project_id, tower_code, tower_name, total_floors, total_units, sort_order) FROM stdin;
\.


--
-- TOC entry 4369 (class 0 OID 24793)
-- Dependencies: 241
-- Data for Name: translation_keys; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.translation_keys (id, namespace_code, key_code, default_text) FROM stdin;
2	ui	ui.sitemap	Bản đồ 2D
107	ui	modal.fieldZalo	Zalo
187	ui	location.cat.all	Tất cả
1	ui	ui.loaderSub	Đang khởi tạo không gian 360°
3	ui	ui.sitemapTitle	Bản đồ 2D
4	ui	ui.gallery	Thư viện
5	ui	ui.galleryTitle	Thư viện ảnh
6	ui	ui.book	Đặt lịch
7	ui	ui.priceFrom	Giá từ
8	ui	ui.viewPricePromo	Xem bảng giá & ưu đãi
9	ui	ui.downloadBrochure	Tải brochure PDF
10	ui	ui.dragTip	Kéo để xoay · Cuộn để zoom
11	ui	ui.search	Tìm kiếm…
12	ui	ui.collapse	Thu gọn
13	ui	ui.expand	Mở rộng thông tin dự án
14	ui	ui.expandNav	Mở bảng điều hướng
15	ui	ui.showUI	Hiện giao diện
16	ui	ui.aiChat	Chat với trợ lý AI
17	ui	ui.skip	Bỏ qua
18	ui	ui.continueHint	Click bất kỳ đâu để tiếp tục →
19	ui	ui.step	Bước {n} / {total}
20	ui	ui.viewIn360	Xem 360°
21	ui	ui.nearbyAmenity	Tiện ích lân cận
22	ui	ui.noResults	Không tìm thấy mục phù hợp
23	ui	ui.units	căn
24	ui	ui.rotate	Tự xoay
25	ui	ui.zoomIn	Phóng to
26	ui	ui.zoomOut	Thu nhỏ
27	ui	ui.fullscreen	Toàn màn hình
28	ui	ui.help	Hướng dẫn sử dụng
29	ui	ui.language	Ngôn ngữ
30	ui	modal.eyebrow	BẢNG GIÁ & CĂN HỘ CÒN TRỐNG
31	ui	modal.title	Tháp A — Mở bán giai đoạn 2
32	ui	modal.desc	Quỹ căn hiện hữu cập nhật theo thời gian thực. Ưu đãi giai đoạn 2: chiết khấu 8% cho thanh toán sớm, cam kết thuê lại 7%/năm trong 24 tháng đầu tiên.
33	ui	modal.col.code	Mã căn
34	ui	modal.col.type	Loại
35	ui	modal.col.area	Diện tích
36	ui	modal.col.price	Giá từ
37	ui	modal.col.avail	Còn lại
38	ui	modal.contactTitle	Để chúng tôi liên hệ lại
39	ui	modal.name	Họ & tên
40	ui	modal.namePh	Nguyễn Văn A
41	ui	modal.phone	Số điện thoại
42	ui	modal.phonePh	09xx xxx xxx
43	ui	modal.interest	Loại căn quan tâm
44	ui	modal.opt.2br	2 phòng ngủ
45	ui	modal.opt.2br1	2 phòng ngủ +1
46	ui	modal.opt.3br	3 phòng ngủ
47	ui	modal.opt.duplex	Duplex / Penthouse
48	ui	modal.note	Ghi chú
49	ui	modal.notePh	Tôi muốn được tư vấn vào cuối tuần…
50	ui	modal.submit	Gửi yêu cầu tư vấn
51	ui	modal.timeline	Tiến độ dự án
52	ui	sitemap.eyebrow	Mặt bằng tổng thể
53	ui	sitemap.title	Bản đồ thiết kế 2D
54	ui	sitemap.desc	Bấm vào các điểm trên bản đồ để vào không gian 360° tương ứng
55	ui	gallery.eyebrow	Thư viện hình ảnh
56	ui	gallery.title	Khám phá Vinhomes Hai Van Bay
57	ui	ai.title	Trợ lý Vinhomes Hai Van Bay
58	ui	ai.active	Đang hoạt động
59	ui	ai.listening	Đang lắng nghe…
60	ui	ai.thinking	Đang suy nghĩ…
61	ui	ai.speaking	Đang trả lời…
62	ui	ai.placeholder	Nhập câu hỏi…
63	ui	ai.close	Đóng
64	ui	ai.noSR	Trình duyệt chưa hỗ trợ nhận dạng giọng nói. Vui lòng dùng Chrome hoặc Edge.
65	ui	ai.micDenied	Bạn cần cho phép truy cập micro để dùng tính năng trò chuyện bằng giọng nói.
66	ui	ai.networkErr	Không thể kết nối dịch vụ nhận dạng giọng nói. Vui lòng thử lại sau.
67	ui	ai.replyStub	Cảm ơn câu hỏi của bạn: "{q}". Đây là phản hồi mẫu — tích hợp LLM thật sẽ thay thế hàm generateReply().
68	ui	tour.brand	Logo dự án — quay về tổng quan.
69	ui	tour.sitemap	Bản đồ thiết kế 2D — các điểm chạm dẫn vào không gian 360°.
70	ui	tour.masterplan	Quy hoạch tổng thể — xem mặt bằng phân khu toàn dự án.
71	ui	tour.properties	Bất động sản — danh sách sản phẩm, căn hộ đang mở bán.
72	ui	tour.amenities	Tiện ích dự án — khám phá tiện ích nội/ngoại khu.
73	ui	tour.legal	Pháp lý & Uy tín — hồ sơ pháp lý, ngân hàng bảo lãnh, đánh giá cư dân.
74	ui	tour.location	Vị trí dự án — bản đồ và các tiện ích xung quanh.
75	ui	tour.timeline	Tiến độ dự án — xem các mốc thi công và bàn giao.
76	ui	tour.gallery	Thư viện ảnh dự án.
77	ui	tour.resources	Tài liệu dự án — brochure, bảng giá, mặt bằng để tải về.
78	ui	tour.book	Đặt lịch tham quan và xem bảng giá chi tiết.
79	ui	tour.ctrlgroup	Cụm điều khiển — tự xoay, zoom, toàn màn hình, chọn ngôn ngữ và mở lại hướng dẫn.
80	ui	tour.rotate	Bật/tắt tự xoay panorama 360°.
81	ui	tour.zoomIn	Phóng to góc nhìn.
82	ui	tour.zoomOut	Thu nhỏ góc nhìn.
83	ui	tour.fullscreen	Bật chế độ toàn màn hình.
84	ui	tour.lang	Đa ngôn ngữ — chọn ngôn ngữ hiển thị (Việt, Anh, Trung, Hàn, Nhật).
85	ui	tour.help	Mở lại hướng dẫn này bất cứ lúc nào.
86	ui	tour.nav	Bảng điều hướng trái — chứa thông tin scene và danh sách các nhóm.
87	ui	tour.search	Tìm kiếm nhanh trong toàn bộ danh sách.
88	ui	tour.list	Các nhóm: Tổng quan, Tiện ích nội/ngoại khu, Mặt bằng, Căn hộ. Click vào tiêu đề để mở/đóng nhóm, click vào mục con để chuyển không gian 360°.
89	ui	tour.collapse	Thu gọn bảng điều hướng để xem panorama rộng hơn.
90	ui	tour.project	Thông tin dự án: giá, trạng thái, các chỉ số chính.
91	ui	tour.pcCollapse	Thu gọn bảng thông tin dự án bên phải.
92	ui	tour.infoFab	Mở lại bảng thông tin dự án khi đã thu gọn.
93	ui	tour.bot	Trợ lý AI — chat text hoặc trò chuyện bằng giọng nói.
94	ui	tour.restore	Khi giao diện bị ẩn (do kéo xoay 360°), bấm nút này để hiện lại.
95	ui	tour.hotspot	Hotspot trong khung 360° — click để vào không gian khác hoặc xem mô tả.
96	ui	ui.vrExperience	VR360 EXPERIENCE
97	ui	ui.expired	Hết ưu đãi
98	ui	ui.noFilterResults	Không tìm thấy căn phù hợp với bộ lọc
99	ui	modal.opt.studio	Studio
100	ui	modal.selectType	— Chọn loại căn —
101	ui	modal.removeUnit	Xoá
102	ui	modal.errRequired	Vui lòng điền Họ tên và Số điện thoại.
103	ui	modal.errPhone	Số điện thoại chưa đúng định dạng (VD: 0901 234 567).
104	ui	modal.sending	Đang gửi…
105	ui	modal.fieldEmail	Email
106	ui	modal.fieldEmailOpt	(tuỳ chọn)
108	ui	modal.fieldZaloNote	(nếu khác SĐT)
109	ui	modal.fieldCodeInterest	Mã căn quan tâm
110	ui	modal.fieldBudget	Ngân sách dự kiến
111	ui	modal.budget.under5	Dưới 5 tỷ
112	ui	modal.budget.5to8	5 – 8 tỷ
113	ui	modal.budget.8to12	8 – 12 tỷ
114	ui	modal.budget.over12	Trên 12 tỷ
115	ui	modal.fieldPurpose	Mục đích mua
116	ui	modal.purpose.live	Ở thực
117	ui	modal.purpose.invest	Đầu tư
118	ui	modal.purpose.both	Cả hai
119	ui	modal.fieldTime	Thời gian muốn xem
120	ui	modal.time.weekend	Cuối tuần
121	ui	modal.time.nextweek	Tuần tới
122	ui	modal.time.flexible	Linh hoạt
123	ui	modal.consentZalo	Đồng ý nhận thông tin qua <strong>Zalo</strong>
124	ui	modal.consentSms	Đồng ý nhận thông tin qua <strong>SMS</strong>
125	ui	modal.successTitle	Đã gửi thành công!
126	ui	modal.successSub	Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.
127	ui	modal.successZalo	Chat Zalo ngay
128	ui	modal.successReset	Gửi yêu cầu khác
129	ui	stepper.title	Đặt lịch tham quan
130	ui	stepper.step1	Chọn căn
131	ui	stepper.step2	Thông tin
132	ui	stepper.step3	Xác nhận
133	ui	stepper.sectionTitle	Căn hộ quan tâm
134	ui	stepper.skipUnit	Chưa chọn căn cụ thể →
135	ui	stepper.filterAll	Tất cả
136	ui	stepper.direction	Hướng
137	ui	stepper.floor	Tầng
138	ui	stepper.next	Tiếp theo
139	ui	stepper.submit	Gửi yêu cầu
140	ui	stepper.back	Quay lại
141	ui	stepper.confirmTitle	Kiểm tra lại thông tin
142	ui	stepper.confirmAction	Nhấn <strong style="color:var(--accent)">Gửi yêu cầu</strong> để hoàn tất.<br/>Chúng tôi sẽ liên hệ trong <strong style="color:var(--fg)">30 phút</strong>.
143	ui	stepper.successTitle	Đã gửi thành công!
144	ui	stepper.successSub	Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.
145	ui	stepper.successZalo	Chat Zalo ngay
146	ui	stepper.successReset	Gửi yêu cầu khác
147	ui	stepper.confirm.unitSelected	Căn đã chọn
148	ui	stepper.confirm.contactInfo	Thông tin liên hệ
149	ui	stepper.confirm.request	Yêu cầu
150	ui	stepper.confirm.name	Họ tên
151	ui	stepper.confirm.phone	Điện thoại
152	ui	stepper.confirm.budget	Ngân sách
153	ui	stepper.confirm.purpose	Mục đích
154	ui	stepper.confirm.time	Thời gian xem
155	ui	stepper.confirm.note	Ghi chú
156	ui	stepper.confirm.contacts	Nhận tin
157	ui	ui.masterplan	Masterplan
158	ui	ui.properties	Bất động sản
159	ui	ui.amenities	Tiện ích
160	ui	ui.legal	Pháp lý
161	ui	ui.location	Vị trí
162	ui	ui.timeline	Tiến độ
163	ui	ui.resources	Tài liệu
164	ui	ui.menu	Menu
165	ui	ui.projectInfo	Thông tin dự án
166	ui	ui.openProjectInfo	Mở thông tin dự án
167	ui	ui.masterplanTitle	Quy hoạch tổng thể
168	ui	ui.propertiesTitle	Bất động sản
169	ui	ui.amenitiesTitle	Tiện ích dự án
170	ui	ui.legalTitle	Pháp lý & Uy tín
171	ui	ui.locationTitle	Vị trí dự án
172	ui	ui.timelineTitle	Tiến độ dự án
173	ui	ui.resourcesTitle	Tài liệu dự án
174	ui	ui.close	Đóng
175	ui	amen.eyebrow	Tiện ích Vinhomes Hai Van Bay
176	ui	amen.title	Hệ thống tiện ích đẳng cấp
177	ui	amen.tab.noiKhu	Nội khu
178	ui	amen.tab.skyAmenity	Cao tầng
179	ui	amen.tab.dichVu	Dịch vụ
180	ui	amen.tab.haTang	Hạ tầng
181	ui	legal.eyebrow	Pháp lý & Uy tín
182	ui	legal.title	Minh bạch — Bảo đảm — Tin cậy
183	ui	legal.docs	Hồ sơ pháp lý
184	ui	legal.reviews	Cư dân nói gì
185	ui	location.eyebrow	Vị trí dự án
186	ui	location.title	Kết nối hoàn hảo
188	ui	location.cat.school	🏫 Trường học
189	ui	location.cat.hospital	🏥 Bệnh viện
190	ui	location.cat.metro	🚇 Metro
191	ui	location.cat.mall	🛍 TTTM
192	ui	location.cat.airport	✈ Sân bay
193	ui	timeline.eyebrow	Tiến độ xây dựng
194	ui	timeline.title	Cập nhật thực địa
195	ui	resources.eyebrow	Tài liệu
196	ui	resources.title	Brochure, Bảng giá, Bộ nhận diện
197	ui	props.eyebrow	Sản phẩm dự án
198	ui	props.title	Bất động sản đang mở bán
199	ui	props.searchPh	Tìm theo mã căn, tên sản phẩm…
200	ui	props.filter	Lọc
201	ui	props.filterTitle	Bộ lọc
202	ui	props.filterClose	Đóng bộ lọc
203	ui	props.filterReset	Xóa bộ lọc
204	ui	pd.back	‹ Danh sách
205	ui	fpv.title	Mặt bằng
206	ui	fpv.zoomIn	Phóng to
207	ui	fpv.zoomOut	Thu nhỏ
208	ui	fpv.zoomReset	Đặt lại
209	ui	fpv.hint	Cuộn để phóng to · Kéo để di chuyển
210	ui	mpf.title	Bộ lọc Masterplan
211	ui	mpf.reset	Đặt lại
212	ui	mpf.apply	Áp dụng
213	ui	mp.close	Đóng
214	ui	modal.filter.unitType	Loại căn
215	ui	modal.filter.floorGroup	Nhóm tầng
216	ui	modal.filter.status	Trạng thái
217	ui	modal.filter.reset	Xóa lọc
218	ui	modal.floor.all	Tất cả
219	ui	modal.floor.low	Thấp (1–15)
220	ui	modal.floor.mid	Trung (16–30)
221	ui	modal.floor.high	Cao (31+)
222	ui	modal.status.all	Tất cả
223	ui	modal.status.available	Còn trống
224	ui	modal.status.holding	Đang giữ
225	ui	modal.status.sold	Đã bán
226	ui	modal.col.floor	Tầng
227	ui	modal.col.area2	DT (m²)
228	ui	modal.col.dir	Hướng
229	ui	modal.col.ppm	Giá/m²
230	ui	modal.col.st	TT
231	ui	modal.col.price2	Giá
596	ui	ui.subdivision	Phân khu
597	ui	ui.subdivisions	Phân khu
598	ui	ui.allTab	Tất cả
599	ui	ui.filtering	Đang lọc
600	ui	ui.filteringBy	Đang lọc theo
601	ui	ui.overviewMode	Tổng quan — hiển thị đầy đủ
602	ui	ui.projectContent	Nội dung dự án
603	ui	ui.noContent	Chưa có nội dung
232	dynamic	Khu Tây Hồ Tây, Hà Nội	Khu Tây Hồ Tây, Hà Nội
233	dynamic	Đang mở bán giai đoạn 2	Đang mở bán giai đoạn 2
234	dynamic	Từ 4.9 tỷ	Từ 4.9 tỷ
235	dynamic	Bể bơi vô cực	Bể bơi vô cực
236	dynamic	Gym & Yoga 1200m²	Gym & Yoga 1200m²
237	dynamic	Spa & Onsen	Spa & Onsen
238	dynamic	Trường liên cấp song ngữ	Trường liên cấp song ngữ
239	dynamic	TTTM 18.000 m²	TTTM 18.000 m²
240	dynamic	Công viên trung tâm	Công viên trung tâm
241	dynamic	Sky lounge tầng 42	Sky lounge tầng 42
242	dynamic	Khu vui chơi trẻ em	Khu vui chơi trẻ em
243	dynamic	Cây xanh nội khu	Cây xanh nội khu
244	dynamic	Mật độ xây dựng	Mật độ xây dựng
245	dynamic	Tới hồ Tây	Tới hồ Tây
246	dynamic	Tầm view panorama	Tầm view panorama
247	dynamic	ha	ha
248	dynamic	phút	phút
249	dynamic	tầng	tầng
250	dynamic	Tổng quan	Tổng quan
251	dynamic	Tiện ích nội khu	Tiện ích nội khu
252	dynamic	Tiện ích ngoại khu	Tiện ích ngoại khu
253	dynamic	Mặt bằng tầng	Mặt bằng tầng
254	dynamic	View 360 căn hộ	View 360 căn hộ
255	dynamic	Tổng quan (Top View)	Tổng quan (Top View)
256	dynamic	Tổng quan (View 1)	Tổng quan (View 1)
257	dynamic	Tổng quan (View 2)	Tổng quan (View 2)
258	dynamic	Tổng quan (View 3)	Tổng quan (View 3)
259	dynamic	Tổng quan (View 4)	Tổng quan (View 4)
260	dynamic	Tổng quan (View 5)	Tổng quan (View 5)
261	dynamic	Bể bơi	Bể bơi
262	dynamic	Đường dạo bộ	Đường dạo bộ
263	dynamic	Sân chơi trẻ em	Sân chơi trẻ em
264	dynamic	Sân thể thao	Sân thể thao
265	dynamic	Sky Lounge	Sky Lounge
266	dynamic	Tuyến Metro 6	Tuyến Metro 6
267	dynamic	Tuyến đường Ánh Sáng	Tuyến đường Ánh Sáng
268	dynamic	Bệnh viện Quốc tế Vinmec	Bệnh viện Quốc tế Vinmec
269	dynamic	Zen Park	Zen Park
270	dynamic	Đại lộ Thăng Long	Đại lộ Thăng Long
271	dynamic	Vincom Mega Mall	Vincom Mega Mall
272	dynamic	TTTM & nhà để xe 10 tầng	TTTM & nhà để xe 10 tầng
273	dynamic	Central Park 10.2ha	Central Park 10.2ha
274	dynamic	Đường Lê Trọng Tấn	Đường Lê Trọng Tấn
275	dynamic	Trường THCS Nguyễn Quý Đức	Trường THCS Nguyễn Quý Đức
276	dynamic	Tòa Thảo Mộc (I5)	Tòa Thảo Mộc (I5)
277	dynamic	Tòa Nguyệt Quế (I4)	Tòa Nguyệt Quế (I4)
278	dynamic	Tòa The Central (I3)	Tòa The Central (I3)
279	dynamic	Tòa The Park (I2)	Tòa The Park (I2)
280	dynamic	Tòa The Lake Premium (I1)	Tòa The Lake Premium (I1)
281	dynamic	Studio - 34m²	Studio - 34m²
282	dynamic	Studio - 35.1m²	Studio - 35.1m²
283	dynamic	1 phòng ngủ + 1 - 43m²	1 phòng ngủ + 1 - 43m²
284	dynamic	2 phòng ngủ + 1 - 46.4m²	2 phòng ngủ + 1 - 46.4m²
285	dynamic	2 phòng ngủ + 1 - 54.6m²	2 phòng ngủ + 1 - 54.6m²
286	dynamic	2 phòng ngủ + 1 - 54.7m²	2 phòng ngủ + 1 - 54.7m²
287	dynamic	2 phòng ngủ + 1 - 59.2m²	2 phòng ngủ + 1 - 59.2m²
288	dynamic	2 phòng ngủ + 1 - 62.2m²	2 phòng ngủ + 1 - 62.2m²
289	dynamic	3 phòng ngủ - 74.5m²	3 phòng ngủ - 74.5m²
290	dynamic	3 phòng ngủ - 75.6m²	3 phòng ngủ - 75.6m²
291	dynamic	Sky Lounge — Tầng 42	Sky Lounge — Tầng 42
292	dynamic	Tầm nhìn 360° toàn cảnh thành phố	Tầm nhìn 360° toàn cảnh thành phố
293	dynamic	Tiện ích	Tiện ích
294	dynamic	Penthouse mẫu — Tháp A	Penthouse mẫu — Tháp A
295	dynamic	Căn 3PN duplex 142m² — tầng 41	Căn 3PN duplex 142m² — tầng 41
296	dynamic	Căn hộ	Căn hộ
297	dynamic	Phòng ngủ Master	Phòng ngủ Master
298	dynamic	Suite riêng — 24m² + walk-in closet	Suite riêng — 24m² + walk-in closet
299	dynamic	Bể bơi vô cực — Tầng 8	Bể bơi vô cực — Tầng 8
300	dynamic	50m × 25m, hệ nước muối thẩm thấu	50m × 25m, hệ nước muối thẩm thấu
301	dynamic	Công viên trung tâm — 12.4ha	Công viên trung tâm — 12.4ha
302	dynamic	Vườn Nhật, hồ điều hòa, sân chạy 2.4km	Vườn Nhật, hồ điều hòa, sân chạy 2.4km
303	dynamic	Toàn cảnh dự án	Toàn cảnh dự án
304	dynamic	Phối cảnh tổng thể 6 tháp	Phối cảnh tổng thể 6 tháp
305	dynamic	Tổng thể	Tổng thể
306	dynamic	Vào penthouse mẫu	Vào penthouse mẫu
307	dynamic	Khu BBQ ngoài trời	Khu BBQ ngoài trời
308	dynamic	Bể bơi tràn 50m hướng tây nhìn hoàng hôn hồ Tây.	Bể bơi tràn 50m hướng tây nhìn hoàng hôn hồ Tây.
309	dynamic	Khu BBQ 24 bàn riêng tư có mái che.	Khu BBQ 24 bàn riêng tư có mái che.
310	dynamic	Phòng khách 38m²	Phòng khách 38m²
311	dynamic	Sang phòng ngủ master	Sang phòng ngủ master
312	dynamic	Bếp đảo Bosch	Bếp đảo Bosch
313	dynamic	Cửa kính từ trần đến sàn, view trực diện hồ Tây.	Cửa kính từ trần đến sàn, view trực diện hồ Tây.
314	dynamic	Trang bị full Bosch, đá Dekton, lò hấp & cảm ứng từ.	Trang bị full Bosch, đá Dekton, lò hấp & cảm ứng từ.
315	dynamic	Tủ âm tường	Tủ âm tường
316	dynamic	Cửa kính lùa toàn cảnh	Cửa kính lùa toàn cảnh
317	dynamic	Quay lại Sky Lounge	Quay lại Sky Lounge
318	dynamic	Tủ walk-in closet 6m² thiết kế riêng.	Tủ walk-in closet 6m² thiết kế riêng.
319	dynamic	Cửa kính cách âm Low-E 3 lớp.	Cửa kính cách âm Low-E 3 lớp.
320	dynamic	Bể trẻ em	Bể trẻ em
321	dynamic	Cabana riêng tư	Cabana riêng tư
322	dynamic	Đi cảnh quan	Đi cảnh quan
323	dynamic	Bể nông 0.4m riêng biệt cho trẻ dưới 6 tuổi.	Bể nông 0.4m riêng biệt cho trẻ dưới 6 tuổi.
324	dynamic	12 cabana có thể đặt riêng.	12 cabana có thể đặt riêng.
325	dynamic	Vườn thiền Zen	Vườn thiền Zen
326	dynamic	Sân chạy bộ 2.4km	Sân chạy bộ 2.4km
327	dynamic	Lên Sky Lounge	Lên Sky Lounge
328	dynamic	Vườn đá Karesansui phong cách Kyoto.	Vườn đá Karesansui phong cách Kyoto.
329	dynamic	Đường runway phủ EPDM giảm chấn.	Đường runway phủ EPDM giảm chấn.
330	dynamic	Tháp A — đang bán	Tháp A — đang bán
331	dynamic	Tháp B & C	Tháp B & C
332	dynamic	Giai đoạn 1 — đã bàn giao 2026.	Giai đoạn 1 — đã bàn giao 2026.
333	dynamic	2PN	2PN
334	dynamic	2PN+1	2PN+1
335	dynamic	3PN	3PN
336	dynamic	Duplex 3PN	Duplex 3PN
337	dynamic	5.4 tỷ	5.4 tỷ
338	dynamic	6.8 tỷ	6.8 tỷ
339	dynamic	8.9 tỷ	8.9 tỷ
340	dynamic	14.2 tỷ	14.2 tỷ
341	dynamic	4.9 tỷ	4.9 tỷ
342	dynamic	Khởi công	Khởi công
343	dynamic	Cất nóc tháp A & B	Cất nóc tháp A & B
344	dynamic	Mở bán GĐ 2	Mở bán GĐ 2
345	dynamic	Hoàn thiện ngoại thất	Hoàn thiện ngoại thất
346	dynamic	Bàn giao tháp A	Bàn giao tháp A
347	dynamic	Q1 / 2024	Q1 / 2024
348	dynamic	Q2 / 2026	Q2 / 2026
349	dynamic	Q1 / 2027	Q1 / 2027
350	dynamic	Q4 / 2027	Q4 / 2027
351	dynamic	dự án Vinhomes Hai Van Bay ngay lúc này	dự án Vinhomes Hai Van Bay ngay lúc này
352	dynamic	18 người đang xem	18 người đang xem
353	dynamic	24 người đang xem	24 người đang xem
354	dynamic	31 người đang xem	31 người đang xem
355	dynamic	Vừa đặt giữ 2PN+1 tầng 22	Vừa đặt giữ 2PN+1 tầng 22
356	dynamic	3 phút trước · Khách Hà Nội	3 phút trước · Khách Hà Nội
357	dynamic	Vừa đặt giữ Duplex tầng 40	Vừa đặt giữ Duplex tầng 40
358	dynamic	12 phút trước · Khách TP.HCM	12 phút trước · Khách TP.HCM
359	dynamic	Còn 49 căn trong đợt này	Còn 49 căn trong đợt này
360	dynamic	Ưu đãi 8% kết thúc sớm	Ưu đãi 8% kết thúc sớm
361	dynamic	Vừa đặt giữ 3PN tầng 35	Vừa đặt giữ 3PN tầng 35
362	dynamic	7 phút trước · Khách nước ngoài	7 phút trước · Khách nước ngoài
363	dynamic	Căn 3PN tầng 28 vừa giữ	Căn 3PN tầng 28 vừa giữ
364	dynamic	Chỉ còn 9 căn 3PN	Chỉ còn 9 căn 3PN
\.


--
-- TOC entry 4349 (class 0 OID 24606)
-- Dependencies: 221
-- Data for Name: user_role_bindings; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.user_role_bindings (id, user_id, role_id, created_at) FROM stdin;
2	2	3	2026-05-22 03:37:47.261563+00
21	21	5	2026-05-22 07:08:30.363589+00
22	22	1	2026-05-22 07:08:30.363589+00
1	1	3	2026-05-22 03:37:47.261563+00
\.


--
-- TOC entry 4347 (class 0 OID 24591)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.users (id, username, password_hash, full_name, email, phone, title, avatar_url, is_active, last_login_at, created_at, updated_at) FROM stdin;
21	dev	$2a$10$0HGyTnMW.1SzSA90usp//uovw0OvVUTGdpXYUolOso0BK3.5gEyrq	Developer	\N	\N	Kỹ thuật — Toàn quyền	\N	t	2026-05-22 07:16:43.136579+00	2026-05-22 07:08:30.363589+00	2026-05-22 07:16:43.136579+00
22	admin	$2a$10$4Gp49.wG4CRS.Hx0rQ/jZOkqk9PE38W/X5.bD022Xn8jqqbX2chbK	Chủ Đầu Tư	\N	\N	Quản trị dự án	\N	t	2026-05-22 07:34:20.729534+00	2026-05-22 07:08:30.363589+00	2026-05-22 07:34:20.729534+00
1	sales	$2a$10$44x7TFqnzquhKRhROYO.BuuezIlOv.bnjIBbG4WDBJNUNZ2eLkWLO	Nguyễn Minh Anh	anh.nguyen@auroraheights.vn	0911 222 333	Test sửa OK	\N	t	2026-05-22 07:25:18.469485+00	2026-05-22 03:37:47.261563+00	2026-05-22 07:34:20.761708+00
2	sales2	$2a$10$FJ9pAyqazHaR8xWn6r9qT.awtFTZtfhXfXh1l0WK0eZF9lrTSWtPu	Trần Bảo Khánh	khanh.tran@auroraheights.vn	0922 333 444	Chuyên viên tư vấn	\N	t	2026-05-22 07:37:34.474889+00	2026-05-22 03:37:47.261563+00	2026-05-22 07:37:34.474889+00
\.


--
-- TOC entry 4380 (class 0 OID 24921)
-- Dependencies: 252
-- Data for Name: vr_hotspots; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.vr_hotspots (id, scene_id, target_scene_id, hotspot_code, hotspot_type, label, description, x_ratio, y_ratio, yaw_deg, pitch_deg, media_url, sort_order, is_active, metadata) FROM stdin;
\.


--
-- TOC entry 4378 (class 0 OID 24896)
-- Dependencies: 250
-- Data for Name: vr_scenes; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.vr_scenes (id, project_id, panorama_id, scene_code, scene_name, scene_type, description, horizon_y, palette_json, sort_order, is_active, metadata, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4497 (class 0 OID 0)
-- Dependencies: 355
-- Name: ai_conversations_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.ai_conversations_id_seq', 1, false);


--
-- TOC entry 4498 (class 0 OID 0)
-- Dependencies: 361
-- Name: ai_live_events_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.ai_live_events_id_seq', 1, false);


--
-- TOC entry 4499 (class 0 OID 0)
-- Dependencies: 359
-- Name: ai_live_sessions_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.ai_live_sessions_id_seq', 1, false);


--
-- TOC entry 4500 (class 0 OID 0)
-- Dependencies: 357
-- Name: ai_messages_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.ai_messages_id_seq', 1, false);


--
-- TOC entry 4501 (class 0 OID 0)
-- Dependencies: 297
-- Name: amenities_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.amenities_id_seq', 184, true);


--
-- TOC entry 4502 (class 0 OID 0)
-- Dependencies: 295
-- Name: amenity_categories_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.amenity_categories_id_seq', 32, true);


--
-- TOC entry 4503 (class 0 OID 0)
-- Dependencies: 353
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.analytics_events_id_seq', 1, false);


--
-- TOC entry 4504 (class 0 OID 0)
-- Dependencies: 351
-- Name: analytics_sessions_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.analytics_sessions_id_seq', 1, false);


--
-- TOC entry 4505 (class 0 OID 0)
-- Dependencies: 347
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.appointments_id_seq', 8, true);


--
-- TOC entry 4506 (class 0 OID 0)
-- Dependencies: 224
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.audit_logs_id_seq', 1, false);


--
-- TOC entry 4507 (class 0 OID 0)
-- Dependencies: 222
-- Name: auth_sessions_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.auth_sessions_id_seq', 11, true);


--
-- TOC entry 4508 (class 0 OID 0)
-- Dependencies: 307
-- Name: construction_milestones_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.construction_milestones_id_seq', 137, true);


--
-- TOC entry 4509 (class 0 OID 0)
-- Dependencies: 333
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.customers_id_seq', 21, true);


--
-- TOC entry 4510 (class 0 OID 0)
-- Dependencies: 311
-- Name: floors_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.floors_id_seq', 1, false);


--
-- TOC entry 4511 (class 0 OID 0)
-- Dependencies: 281
-- Name: gallery_folders_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.gallery_folders_id_seq', 112, true);


--
-- TOC entry 4512 (class 0 OID 0)
-- Dependencies: 283
-- Name: gallery_items_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.gallery_items_id_seq', 162, true);


--
-- TOC entry 4513 (class 0 OID 0)
-- Dependencies: 289
-- Name: key_visual_groups_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.key_visual_groups_id_seq', 40, true);


--
-- TOC entry 4514 (class 0 OID 0)
-- Dependencies: 291
-- Name: key_visual_items_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.key_visual_items_id_seq', 60, true);


--
-- TOC entry 4515 (class 0 OID 0)
-- Dependencies: 238
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.languages_id_seq', 5, true);


--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 345
-- Name: lead_assignments_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.lead_assignments_id_seq', 5, true);


--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 341
-- Name: lead_consents_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.lead_consents_id_seq', 1, false);


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 335
-- Name: lead_sources_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.lead_sources_id_seq', 9, true);


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 343
-- Name: lead_status_history_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.lead_status_history_id_seq', 1, false);


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 339
-- Name: leads_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.leads_id_seq', 17, true);


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 299
-- Name: legal_documents_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.legal_documents_id_seq', 159, true);


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 273
-- Name: masterplan_categories_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.masterplan_categories_id_seq', 60, true);


--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 277
-- Name: masterplan_filter_groups_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.masterplan_filter_groups_id_seq', 40, true);


--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 279
-- Name: masterplan_filter_options_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.masterplan_filter_options_id_seq', 180, true);


--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 275
-- Name: masterplan_markers_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.masterplan_markers_id_seq', 91, true);


--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 271
-- Name: masterplans_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.masterplans_id_seq', 10, true);


--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 253
-- Name: menu_groups_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.menu_groups_id_seq', 200, true);


--
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 258
-- Name: menu_item_detail_images_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.menu_item_detail_images_id_seq', 118, true);


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 260
-- Name: menu_item_detail_specs_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.menu_item_detail_specs_id_seq', 236, true);


--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 263
-- Name: menu_item_subdivision_facts_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.menu_item_subdivision_facts_id_seq', 160, true);


--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 265
-- Name: menu_item_subdivision_points_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.menu_item_subdivision_points_id_seq', 180, true);


--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 255
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.menu_items_id_seq', 430, true);


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 305
-- Name: nearby_places_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.nearby_places_id_seq', 156, true);


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 247
-- Name: panorama_assets_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.panorama_assets_id_seq', 1, false);


--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 234
-- Name: project_card_highlights_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_card_highlights_id_seq', 50, true);


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 236
-- Name: project_card_quick_links_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_card_quick_links_id_seq', 40, true);


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 303
-- Name: project_locations_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_locations_id_seq', 36, true);


--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 228
-- Name: project_memberships_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_memberships_id_seq', 25, true);


--
-- TOC entry 4539 (class 0 OID 0)
-- Dependencies: 287
-- Name: project_resources_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_resources_id_seq', 180, true);


--
-- TOC entry 4540 (class 0 OID 0)
-- Dependencies: 293
-- Name: project_statistics_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_statistics_id_seq', 184, true);


--
-- TOC entry 4541 (class 0 OID 0)
-- Dependencies: 301
-- Name: project_testimonials_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_testimonials_id_seq', 58, true);


--
-- TOC entry 4542 (class 0 OID 0)
-- Dependencies: 242
-- Name: project_translations_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_translations_id_seq', 3648, true);


--
-- TOC entry 4543 (class 0 OID 0)
-- Dependencies: 230
-- Name: project_versions_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.project_versions_id_seq', 1, false);


--
-- TOC entry 4544 (class 0 OID 0)
-- Dependencies: 226
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.projects_id_seq', 10, true);


--
-- TOC entry 4545 (class 0 OID 0)
-- Dependencies: 315
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.properties_id_seq', 60, true);


--
-- TOC entry 4546 (class 0 OID 0)
-- Dependencies: 325
-- Name: property_documents_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_documents_id_seq', 180, true);


--
-- TOC entry 4547 (class 0 OID 0)
-- Dependencies: 319
-- Name: property_floor_plans_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_floor_plans_id_seq', 240, true);


--
-- TOC entry 4548 (class 0 OID 0)
-- Dependencies: 321
-- Name: property_highlights_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_highlights_id_seq', 180, true);


--
-- TOC entry 4549 (class 0 OID 0)
-- Dependencies: 317
-- Name: property_images_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_images_id_seq', 180, true);


--
-- TOC entry 4550 (class 0 OID 0)
-- Dependencies: 327
-- Name: property_milestones_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_milestones_id_seq', 240, true);


--
-- TOC entry 4551 (class 0 OID 0)
-- Dependencies: 323
-- Name: property_policies_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_policies_id_seq', 240, true);


--
-- TOC entry 4552 (class 0 OID 0)
-- Dependencies: 331
-- Name: property_price_history_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_price_history_id_seq', 1, false);


--
-- TOC entry 4553 (class 0 OID 0)
-- Dependencies: 349
-- Name: property_reservations_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_reservations_id_seq', 4, true);


--
-- TOC entry 4554 (class 0 OID 0)
-- Dependencies: 329
-- Name: property_status_history_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_status_history_id_seq', 4, true);


--
-- TOC entry 4555 (class 0 OID 0)
-- Dependencies: 313
-- Name: property_types_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.property_types_id_seq', 4, true);


--
-- TOC entry 4556 (class 0 OID 0)
-- Dependencies: 285
-- Name: resource_categories_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.resource_categories_id_seq', 1, false);


--
-- TOC entry 4557 (class 0 OID 0)
-- Dependencies: 216
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.roles_id_seq', 9, true);


--
-- TOC entry 4558 (class 0 OID 0)
-- Dependencies: 337
-- Name: sales_public_links_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.sales_public_links_id_seq', 1, false);


--
-- TOC entry 4559 (class 0 OID 0)
-- Dependencies: 269
-- Name: site_map_points_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.site_map_points_id_seq', 70, true);


--
-- TOC entry 4560 (class 0 OID 0)
-- Dependencies: 267
-- Name: site_maps_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.site_maps_id_seq', 10, true);


--
-- TOC entry 4561 (class 0 OID 0)
-- Dependencies: 244
-- Name: theme_presets_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.theme_presets_id_seq', 1, false);


--
-- TOC entry 4562 (class 0 OID 0)
-- Dependencies: 309
-- Name: towers_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.towers_id_seq', 1, false);


--
-- TOC entry 4563 (class 0 OID 0)
-- Dependencies: 240
-- Name: translation_keys_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.translation_keys_id_seq', 736, true);


--
-- TOC entry 4564 (class 0 OID 0)
-- Dependencies: 220
-- Name: user_role_bindings_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.user_role_bindings_id_seq', 25, true);


--
-- TOC entry 4565 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.users_id_seq', 25, true);


--
-- TOC entry 4566 (class 0 OID 0)
-- Dependencies: 251
-- Name: vr_hotspots_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.vr_hotspots_id_seq', 1, false);


--
-- TOC entry 4567 (class 0 OID 0)
-- Dependencies: 249
-- Name: vr_scenes_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.vr_scenes_id_seq', 1, false);


--
-- TOC entry 4045 (class 2606 OID 25962)
-- Name: ai_conversations ai_conversations_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_conversations
    ADD CONSTRAINT ai_conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 4053 (class 2606 OID 26032)
-- Name: ai_live_events ai_live_events_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_live_events
    ADD CONSTRAINT ai_live_events_pkey PRIMARY KEY (id);


--
-- TOC entry 4051 (class 2606 OID 26008)
-- Name: ai_live_sessions ai_live_sessions_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_live_sessions
    ADD CONSTRAINT ai_live_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4048 (class 2606 OID 25994)
-- Name: ai_messages ai_messages_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_messages
    ADD CONSTRAINT ai_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3956 (class 2606 OID 25350)
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (id);


--
-- TOC entry 3952 (class 2606 OID 25332)
-- Name: amenity_categories amenity_categories_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.amenity_categories
    ADD CONSTRAINT amenity_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3954 (class 2606 OID 25334)
-- Name: amenity_categories amenity_categories_project_id_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.amenity_categories
    ADD CONSTRAINT amenity_categories_project_id_code_key UNIQUE (project_id, code);


--
-- TOC entry 4042 (class 2606 OID 25916)
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- TOC entry 4039 (class 2606 OID 25887)
-- Name: analytics_sessions analytics_sessions_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_sessions
    ADD CONSTRAINT analytics_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4033 (class 2606 OID 25814)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- TOC entry 3817 (class 2606 OID 24648)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3813 (class 2606 OID 24632)
-- Name: auth_sessions auth_sessions_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.auth_sessions
    ADD CONSTRAINT auth_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3815 (class 2606 OID 24634)
-- Name: auth_sessions auth_sessions_session_token_hash_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.auth_sessions
    ADD CONSTRAINT auth_sessions_session_token_hash_key UNIQUE (session_token_hash);


--
-- TOC entry 3969 (class 2606 OID 25428)
-- Name: construction_milestones construction_milestones_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.construction_milestones
    ADD CONSTRAINT construction_milestones_pkey PRIMARY KEY (id);


--
-- TOC entry 4011 (class 2606 OID 25655)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3976 (class 2606 OID 25454)
-- Name: floors floors_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.floors
    ADD CONSTRAINT floors_pkey PRIMARY KEY (id);


--
-- TOC entry 3978 (class 2606 OID 25456)
-- Name: floors floors_tower_id_floor_number_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.floors
    ADD CONSTRAINT floors_tower_id_floor_number_key UNIQUE (tower_id, floor_number);


--
-- TOC entry 3928 (class 2606 OID 25208)
-- Name: gallery_folders gallery_folders_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.gallery_folders
    ADD CONSTRAINT gallery_folders_pkey PRIMARY KEY (id);


--
-- TOC entry 3930 (class 2606 OID 25210)
-- Name: gallery_folders gallery_folders_project_id_folder_name_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.gallery_folders
    ADD CONSTRAINT gallery_folders_project_id_folder_name_key UNIQUE (project_id, folder_name);


--
-- TOC entry 3932 (class 2606 OID 25229)
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3943 (class 2606 OID 25289)
-- Name: key_visual_groups key_visual_groups_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.key_visual_groups
    ADD CONSTRAINT key_visual_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3945 (class 2606 OID 25291)
-- Name: key_visual_groups key_visual_groups_project_id_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.key_visual_groups
    ADD CONSTRAINT key_visual_groups_project_id_code_key UNIQUE (project_id, code);


--
-- TOC entry 3948 (class 2606 OID 25308)
-- Name: key_visual_items key_visual_items_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.key_visual_items
    ADD CONSTRAINT key_visual_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3843 (class 2606 OID 24791)
-- Name: languages languages_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.languages
    ADD CONSTRAINT languages_code_key UNIQUE (code);


--
-- TOC entry 3845 (class 2606 OID 24789)
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- TOC entry 4056 (class 2606 OID 26081)
-- Name: lead_assignment_counters lead_assignment_counters_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_assignment_counters
    ADD CONSTRAINT lead_assignment_counters_pkey PRIMARY KEY (project_id);


--
-- TOC entry 4031 (class 2606 OID 25787)
-- Name: lead_assignments lead_assignments_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_assignments
    ADD CONSTRAINT lead_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4025 (class 2606 OID 25756)
-- Name: lead_consents lead_consents_lead_id_channel_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_consents
    ADD CONSTRAINT lead_consents_lead_id_channel_code_key UNIQUE (lead_id, channel_code);


--
-- TOC entry 4027 (class 2606 OID 25754)
-- Name: lead_consents lead_consents_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_consents
    ADD CONSTRAINT lead_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 4013 (class 2606 OID 25665)
-- Name: lead_sources lead_sources_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_sources
    ADD CONSTRAINT lead_sources_pkey PRIMARY KEY (id);


--
-- TOC entry 4015 (class 2606 OID 25667)
-- Name: lead_sources lead_sources_project_id_source_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_sources
    ADD CONSTRAINT lead_sources_project_id_source_code_key UNIQUE (project_id, source_code);


--
-- TOC entry 4029 (class 2606 OID 25770)
-- Name: lead_status_history lead_status_history_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_status_history
    ADD CONSTRAINT lead_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4023 (class 2606 OID 25710)
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- TOC entry 3959 (class 2606 OID 25370)
-- Name: legal_documents legal_documents_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.legal_documents
    ADD CONSTRAINT legal_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 3910 (class 2606 OID 25142)
-- Name: masterplan_categories masterplan_categories_masterplan_id_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_categories
    ADD CONSTRAINT masterplan_categories_masterplan_id_code_key UNIQUE (masterplan_id, code);


--
-- TOC entry 3912 (class 2606 OID 25140)
-- Name: masterplan_categories masterplan_categories_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_categories
    ADD CONSTRAINT masterplan_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3919 (class 2606 OID 25180)
-- Name: masterplan_filter_groups masterplan_filter_groups_masterplan_id_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_filter_groups
    ADD CONSTRAINT masterplan_filter_groups_masterplan_id_code_key UNIQUE (masterplan_id, code);


--
-- TOC entry 3921 (class 2606 OID 25178)
-- Name: masterplan_filter_groups masterplan_filter_groups_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_filter_groups
    ADD CONSTRAINT masterplan_filter_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3924 (class 2606 OID 25194)
-- Name: masterplan_filter_options masterplan_filter_options_filter_group_id_option_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_filter_options
    ADD CONSTRAINT masterplan_filter_options_filter_group_id_option_code_key UNIQUE (filter_group_id, option_code);


--
-- TOC entry 3926 (class 2606 OID 25192)
-- Name: masterplan_filter_options masterplan_filter_options_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_filter_options
    ADD CONSTRAINT masterplan_filter_options_pkey PRIMARY KEY (id);


--
-- TOC entry 3915 (class 2606 OID 25161)
-- Name: masterplan_markers masterplan_markers_masterplan_id_marker_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_markers
    ADD CONSTRAINT masterplan_markers_masterplan_id_marker_code_key UNIQUE (masterplan_id, marker_code);


--
-- TOC entry 3917 (class 2606 OID 25159)
-- Name: masterplan_markers masterplan_markers_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_markers
    ADD CONSTRAINT masterplan_markers_pkey PRIMARY KEY (id);


--
-- TOC entry 3905 (class 2606 OID 25121)
-- Name: masterplans masterplans_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplans
    ADD CONSTRAINT masterplans_pkey PRIMARY KEY (id);


--
-- TOC entry 3907 (class 2606 OID 25123)
-- Name: masterplans masterplans_project_id_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplans
    ADD CONSTRAINT masterplans_project_id_key UNIQUE (project_id);


--
-- TOC entry 3873 (class 2606 OID 24953)
-- Name: menu_groups menu_groups_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_groups
    ADD CONSTRAINT menu_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3875 (class 2606 OID 24955)
-- Name: menu_groups menu_groups_project_id_parent_menu_item_id_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_groups
    ADD CONSTRAINT menu_groups_project_id_parent_menu_item_id_code_key UNIQUE (project_id, parent_menu_item_id, code);


--
-- TOC entry 3885 (class 2606 OID 25013)
-- Name: menu_item_detail_images menu_item_detail_images_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_detail_images
    ADD CONSTRAINT menu_item_detail_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3888 (class 2606 OID 25025)
-- Name: menu_item_detail_specs menu_item_detail_specs_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_detail_specs
    ADD CONSTRAINT menu_item_detail_specs_pkey PRIMARY KEY (id);


--
-- TOC entry 3882 (class 2606 OID 24999)
-- Name: menu_item_details menu_item_details_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_details
    ADD CONSTRAINT menu_item_details_pkey PRIMARY KEY (menu_item_id);


--
-- TOC entry 3893 (class 2606 OID 25049)
-- Name: menu_item_subdivision_facts menu_item_subdivision_facts_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_subdivision_facts
    ADD CONSTRAINT menu_item_subdivision_facts_pkey PRIMARY KEY (id);


--
-- TOC entry 3896 (class 2606 OID 25063)
-- Name: menu_item_subdivision_points menu_item_subdivision_points_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_subdivision_points
    ADD CONSTRAINT menu_item_subdivision_points_pkey PRIMARY KEY (id);


--
-- TOC entry 3890 (class 2606 OID 25037)
-- Name: menu_item_subdivisions menu_item_subdivisions_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_subdivisions
    ADD CONSTRAINT menu_item_subdivisions_pkey PRIMARY KEY (menu_item_id);


--
-- TOC entry 3878 (class 2606 OID 24972)
-- Name: menu_items menu_items_menu_group_id_item_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_items
    ADD CONSTRAINT menu_items_menu_group_id_item_code_key UNIQUE (menu_group_id, item_code);


--
-- TOC entry 3880 (class 2606 OID 24970)
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3967 (class 2606 OID 25413)
-- Name: nearby_places nearby_places_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.nearby_places
    ADD CONSTRAINT nearby_places_pkey PRIMARY KEY (id);


--
-- TOC entry 3859 (class 2606 OID 24887)
-- Name: panorama_assets panorama_assets_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.panorama_assets
    ADD CONSTRAINT panorama_assets_pkey PRIMARY KEY (id);


--
-- TOC entry 3861 (class 2606 OID 24889)
-- Name: panorama_assets panorama_assets_project_id_panorama_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.panorama_assets
    ADD CONSTRAINT panorama_assets_project_id_panorama_code_key UNIQUE (project_id, panorama_code);


--
-- TOC entry 3839 (class 2606 OID 24763)
-- Name: project_card_highlights project_card_highlights_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_card_highlights
    ADD CONSTRAINT project_card_highlights_pkey PRIMARY KEY (id);


--
-- TOC entry 3837 (class 2606 OID 24746)
-- Name: project_card_overviews project_card_overviews_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_card_overviews
    ADD CONSTRAINT project_card_overviews_pkey PRIMARY KEY (project_id);


--
-- TOC entry 3841 (class 2606 OID 24776)
-- Name: project_card_quick_links project_card_quick_links_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_card_quick_links
    ADD CONSTRAINT project_card_quick_links_pkey PRIMARY KEY (id);


--
-- TOC entry 3963 (class 2606 OID 25398)
-- Name: project_locations project_locations_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_locations
    ADD CONSTRAINT project_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 3965 (class 2606 OID 25400)
-- Name: project_locations project_locations_project_id_subdivision_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_locations
    ADD CONSTRAINT project_locations_project_id_subdivision_code_key UNIQUE (project_id, subdivision_code);


--
-- TOC entry 3825 (class 2606 OID 24677)
-- Name: project_memberships project_memberships_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_memberships
    ADD CONSTRAINT project_memberships_pkey PRIMARY KEY (id);


--
-- TOC entry 3827 (class 2606 OID 24681)
-- Name: project_memberships project_memberships_project_id_public_slug_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_memberships
    ADD CONSTRAINT project_memberships_project_id_public_slug_key UNIQUE (project_id, public_slug);


--
-- TOC entry 3829 (class 2606 OID 24679)
-- Name: project_memberships project_memberships_project_id_user_id_role_id_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_memberships
    ADD CONSTRAINT project_memberships_project_id_user_id_role_id_key UNIQUE (project_id, user_id, role_id);


--
-- TOC entry 3939 (class 2606 OID 25270)
-- Name: project_resources project_resources_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_resources
    ADD CONSTRAINT project_resources_pkey PRIMARY KEY (id);


--
-- TOC entry 3941 (class 2606 OID 25272)
-- Name: project_resources project_resources_project_id_subdivision_code_resource_key_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_resources
    ADD CONSTRAINT project_resources_project_id_subdivision_code_resource_key_key UNIQUE (project_id, subdivision_code, resource_key);


--
-- TOC entry 3835 (class 2606 OID 24728)
-- Name: project_settings project_settings_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_settings
    ADD CONSTRAINT project_settings_pkey PRIMARY KEY (project_id);


--
-- TOC entry 3950 (class 2606 OID 25320)
-- Name: project_statistics project_statistics_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_statistics
    ADD CONSTRAINT project_statistics_pkey PRIMARY KEY (id);


--
-- TOC entry 3961 (class 2606 OID 25385)
-- Name: project_testimonials project_testimonials_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_testimonials
    ADD CONSTRAINT project_testimonials_pkey PRIMARY KEY (id);


--
-- TOC entry 3857 (class 2606 OID 24861)
-- Name: project_themes project_themes_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_themes
    ADD CONSTRAINT project_themes_pkey PRIMARY KEY (project_id);


--
-- TOC entry 3851 (class 2606 OID 24810)
-- Name: project_translations project_translations_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_translations
    ADD CONSTRAINT project_translations_pkey PRIMARY KEY (id);


--
-- TOC entry 3853 (class 2606 OID 24812)
-- Name: project_translations project_translations_project_id_language_id_translation_key_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_translations
    ADD CONSTRAINT project_translations_project_id_language_id_translation_key_key UNIQUE (project_id, language_id, translation_key_id);


--
-- TOC entry 3831 (class 2606 OID 24706)
-- Name: project_versions project_versions_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_versions
    ADD CONSTRAINT project_versions_pkey PRIMARY KEY (id);


--
-- TOC entry 3833 (class 2606 OID 24708)
-- Name: project_versions project_versions_project_id_version_no_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_versions
    ADD CONSTRAINT project_versions_project_id_version_no_key UNIQUE (project_id, version_no);


--
-- TOC entry 3820 (class 2606 OID 24667)
-- Name: projects projects_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.projects
    ADD CONSTRAINT projects_code_key UNIQUE (code);


--
-- TOC entry 3822 (class 2606 OID 24665)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 3987 (class 2606 OID 25490)
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- TOC entry 3989 (class 2606 OID 25492)
-- Name: properties properties_project_id_property_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_project_id_property_code_key UNIQUE (project_id, property_code);


--
-- TOC entry 4002 (class 2606 OID 25589)
-- Name: property_documents property_documents_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_documents
    ADD CONSTRAINT property_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 3995 (class 2606 OID 25546)
-- Name: property_floor_plans property_floor_plans_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_floor_plans
    ADD CONSTRAINT property_floor_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 3997 (class 2606 OID 25560)
-- Name: property_highlights property_highlights_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_highlights
    ADD CONSTRAINT property_highlights_pkey PRIMARY KEY (id);


--
-- TOC entry 3992 (class 2606 OID 25532)
-- Name: property_images property_images_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_images
    ADD CONSTRAINT property_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4005 (class 2606 OID 25602)
-- Name: property_milestones property_milestones_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_milestones
    ADD CONSTRAINT property_milestones_pkey PRIMARY KEY (id);


--
-- TOC entry 3999 (class 2606 OID 25574)
-- Name: property_policies property_policies_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_policies
    ADD CONSTRAINT property_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 4009 (class 2606 OID 25635)
-- Name: property_price_history property_price_history_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_price_history
    ADD CONSTRAINT property_price_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4037 (class 2606 OID 25852)
-- Name: property_reservations property_reservations_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_reservations
    ADD CONSTRAINT property_reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 4007 (class 2606 OID 25616)
-- Name: property_status_history property_status_history_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_status_history
    ADD CONSTRAINT property_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3980 (class 2606 OID 25469)
-- Name: property_types property_types_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_types
    ADD CONSTRAINT property_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3982 (class 2606 OID 25471)
-- Name: property_types property_types_project_id_type_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_types
    ADD CONSTRAINT property_types_project_id_type_code_key UNIQUE (project_id, type_code);


--
-- TOC entry 3935 (class 2606 OID 25251)
-- Name: resource_categories resource_categories_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.resource_categories
    ADD CONSTRAINT resource_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3937 (class 2606 OID 25253)
-- Name: resource_categories resource_categories_project_id_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.resource_categories
    ADD CONSTRAINT resource_categories_project_id_code_key UNIQUE (project_id, code);


--
-- TOC entry 3801 (class 2606 OID 24589)
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- TOC entry 3803 (class 2606 OID 24587)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4017 (class 2606 OID 25682)
-- Name: sales_public_links sales_public_links_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.sales_public_links
    ADD CONSTRAINT sales_public_links_pkey PRIMARY KEY (id);


--
-- TOC entry 4019 (class 2606 OID 25684)
-- Name: sales_public_links sales_public_links_project_id_slug_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.sales_public_links
    ADD CONSTRAINT sales_public_links_project_id_slug_key UNIQUE (project_id, slug);


--
-- TOC entry 3901 (class 2606 OID 25095)
-- Name: site_map_points site_map_points_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.site_map_points
    ADD CONSTRAINT site_map_points_pkey PRIMARY KEY (id);


--
-- TOC entry 3903 (class 2606 OID 25097)
-- Name: site_map_points site_map_points_site_map_id_point_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.site_map_points
    ADD CONSTRAINT site_map_points_site_map_id_point_code_key UNIQUE (site_map_id, point_code);


--
-- TOC entry 3898 (class 2606 OID 25078)
-- Name: site_maps site_maps_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.site_maps
    ADD CONSTRAINT site_maps_pkey PRIMARY KEY (id);


--
-- TOC entry 3855 (class 2606 OID 24843)
-- Name: theme_presets theme_presets_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.theme_presets
    ADD CONSTRAINT theme_presets_pkey PRIMARY KEY (id);


--
-- TOC entry 3972 (class 2606 OID 25440)
-- Name: towers towers_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.towers
    ADD CONSTRAINT towers_pkey PRIMARY KEY (id);


--
-- TOC entry 3974 (class 2606 OID 25442)
-- Name: towers towers_project_id_tower_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.towers
    ADD CONSTRAINT towers_project_id_tower_code_key UNIQUE (project_id, tower_code);


--
-- TOC entry 3847 (class 2606 OID 24801)
-- Name: translation_keys translation_keys_namespace_code_key_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.translation_keys
    ADD CONSTRAINT translation_keys_namespace_code_key_code_key UNIQUE (namespace_code, key_code);


--
-- TOC entry 3849 (class 2606 OID 24799)
-- Name: translation_keys translation_keys_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.translation_keys
    ADD CONSTRAINT translation_keys_pkey PRIMARY KEY (id);


--
-- TOC entry 3809 (class 2606 OID 24611)
-- Name: user_role_bindings user_role_bindings_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.user_role_bindings
    ADD CONSTRAINT user_role_bindings_pkey PRIMARY KEY (id);


--
-- TOC entry 3811 (class 2606 OID 24613)
-- Name: user_role_bindings user_role_bindings_user_id_role_id_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.user_role_bindings
    ADD CONSTRAINT user_role_bindings_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- TOC entry 3805 (class 2606 OID 24601)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3807 (class 2606 OID 24603)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3869 (class 2606 OID 24932)
-- Name: vr_hotspots vr_hotspots_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_hotspots
    ADD CONSTRAINT vr_hotspots_pkey PRIMARY KEY (id);


--
-- TOC entry 3871 (class 2606 OID 24934)
-- Name: vr_hotspots vr_hotspots_scene_id_hotspot_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_hotspots
    ADD CONSTRAINT vr_hotspots_scene_id_hotspot_code_key UNIQUE (scene_id, hotspot_code);


--
-- TOC entry 3864 (class 2606 OID 24906)
-- Name: vr_scenes vr_scenes_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_scenes
    ADD CONSTRAINT vr_scenes_pkey PRIMARY KEY (id);


--
-- TOC entry 3866 (class 2606 OID 24908)
-- Name: vr_scenes vr_scenes_project_id_scene_code_key; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_scenes
    ADD CONSTRAINT vr_scenes_project_id_scene_code_key UNIQUE (project_id, scene_code);


--
-- TOC entry 4046 (class 1259 OID 26067)
-- Name: idx_ai_conversations_project_started; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_ai_conversations_project_started ON app.ai_conversations USING btree (project_id, started_at DESC);


--
-- TOC entry 4054 (class 1259 OID 26069)
-- Name: idx_ai_live_events_session_created; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_ai_live_events_session_created ON app.ai_live_events USING btree (ai_live_session_id, created_at);


--
-- TOC entry 4049 (class 1259 OID 26068)
-- Name: idx_ai_messages_conversation_created; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_ai_messages_conversation_created ON app.ai_messages USING btree (conversation_id, created_at);


--
-- TOC entry 3957 (class 1259 OID 26045)
-- Name: idx_amenities_project_category_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_amenities_project_category_sort ON app.amenities USING btree (project_id, amenity_category_id, sort_order);


--
-- TOC entry 4043 (class 1259 OID 26066)
-- Name: idx_analytics_events_project_event_time; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_analytics_events_project_event_time ON app.analytics_events USING btree (project_id, event_name, event_at DESC);


--
-- TOC entry 4040 (class 1259 OID 26065)
-- Name: idx_analytics_sessions_project_started; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_analytics_sessions_project_started ON app.analytics_sessions USING btree (project_id, started_at DESC);


--
-- TOC entry 4034 (class 1259 OID 26063)
-- Name: idx_appointments_project_start; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_appointments_project_start ON app.appointments USING btree (project_id, start_at);


--
-- TOC entry 3818 (class 1259 OID 26070)
-- Name: idx_audit_logs_actor_created; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_audit_logs_actor_created ON app.audit_logs USING btree (actor_user_id, created_at DESC);


--
-- TOC entry 3970 (class 1259 OID 26046)
-- Name: idx_construction_milestones_project_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_construction_milestones_project_sort ON app.construction_milestones USING btree (project_id, sort_order);


--
-- TOC entry 3933 (class 1259 OID 26043)
-- Name: idx_gallery_items_project_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_gallery_items_project_sort ON app.gallery_items USING btree (project_id, sort_order);


--
-- TOC entry 3946 (class 1259 OID 26044)
-- Name: idx_key_visual_items_group_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_key_visual_items_group_sort ON app.key_visual_items USING btree (key_visual_group_id, sort_order);


--
-- TOC entry 4020 (class 1259 OID 26062)
-- Name: idx_leads_assigned_user; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_leads_assigned_user ON app.leads USING btree (assigned_user_id, status_code);


--
-- TOC entry 4021 (class 1259 OID 26061)
-- Name: idx_leads_project_status; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_leads_project_status ON app.leads USING btree (project_id, status_code, created_at DESC);


--
-- TOC entry 3908 (class 1259 OID 26052)
-- Name: idx_masterplan_categories_plan; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_masterplan_categories_plan ON app.masterplan_categories USING btree (masterplan_id, sort_order);


--
-- TOC entry 3922 (class 1259 OID 26053)
-- Name: idx_masterplan_filter_options_group; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_masterplan_filter_options_group ON app.masterplan_filter_options USING btree (filter_group_id, sort_order);


--
-- TOC entry 3913 (class 1259 OID 26051)
-- Name: idx_masterplan_markers_plan; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_masterplan_markers_plan ON app.masterplan_markers USING btree (masterplan_id, sort_order);


--
-- TOC entry 3883 (class 1259 OID 26047)
-- Name: idx_menu_item_detail_images_item; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_menu_item_detail_images_item ON app.menu_item_detail_images USING btree (menu_item_id, sort_order);


--
-- TOC entry 3886 (class 1259 OID 26048)
-- Name: idx_menu_item_detail_specs_item; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_menu_item_detail_specs_item ON app.menu_item_detail_specs USING btree (menu_item_id, sort_order);


--
-- TOC entry 3891 (class 1259 OID 26049)
-- Name: idx_menu_item_subdivision_facts_item; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_menu_item_subdivision_facts_item ON app.menu_item_subdivision_facts USING btree (menu_item_id, sort_order);


--
-- TOC entry 3894 (class 1259 OID 26050)
-- Name: idx_menu_item_subdivision_points_item; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_menu_item_subdivision_points_item ON app.menu_item_subdivision_points USING btree (menu_item_id, sort_order);


--
-- TOC entry 3876 (class 1259 OID 26041)
-- Name: idx_menu_items_group_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_menu_items_group_sort ON app.menu_items USING btree (menu_group_id, sort_order);


--
-- TOC entry 3823 (class 1259 OID 26038)
-- Name: idx_project_memberships_user; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_project_memberships_user ON app.project_memberships USING btree (user_id);


--
-- TOC entry 3983 (class 1259 OID 26054)
-- Name: idx_properties_project_status; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_properties_project_status ON app.properties USING btree (project_id, status_code);


--
-- TOC entry 3984 (class 1259 OID 26055)
-- Name: idx_properties_project_tower_floor; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_properties_project_tower_floor ON app.properties USING btree (project_id, tower_id, floor_id);


--
-- TOC entry 3985 (class 1259 OID 26056)
-- Name: idx_properties_sales_user; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_properties_sales_user ON app.properties USING btree (sales_user_id);


--
-- TOC entry 4000 (class 1259 OID 26059)
-- Name: idx_property_documents_property; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_property_documents_property ON app.property_documents USING btree (property_id, sort_order);


--
-- TOC entry 3993 (class 1259 OID 26058)
-- Name: idx_property_floor_plans_property; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_property_floor_plans_property ON app.property_floor_plans USING btree (property_id, sort_order);


--
-- TOC entry 3990 (class 1259 OID 26057)
-- Name: idx_property_images_property; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_property_images_property ON app.property_images USING btree (property_id, sort_order);


--
-- TOC entry 4003 (class 1259 OID 26060)
-- Name: idx_property_milestones_property; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_property_milestones_property ON app.property_milestones USING btree (property_id, sort_order);


--
-- TOC entry 4035 (class 1259 OID 26064)
-- Name: idx_property_reservations_property_status; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_property_reservations_property_status ON app.property_reservations USING btree (property_id, status_code);


--
-- TOC entry 3899 (class 1259 OID 26042)
-- Name: idx_site_map_points_map_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_site_map_points_map_sort ON app.site_map_points USING btree (site_map_id, sort_order);


--
-- TOC entry 3867 (class 1259 OID 26040)
-- Name: idx_vr_hotspots_scene_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_vr_hotspots_scene_sort ON app.vr_hotspots USING btree (scene_id, sort_order);


--
-- TOC entry 3862 (class 1259 OID 26039)
-- Name: idx_vr_scenes_project_sort; Type: INDEX; Schema: app; Owner: postgres
--

CREATE INDEX idx_vr_scenes_project_sort ON app.vr_scenes USING btree (project_id, sort_order);


--
-- TOC entry 4199 (class 2620 OID 25840)
-- Name: appointments trg_appointments_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON app.appointments FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4197 (class 2620 OID 25656)
-- Name: customers trg_customers_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON app.customers FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4198 (class 2620 OID 25746)
-- Name: leads trg_leads_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON app.leads FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4194 (class 2620 OID 24668)
-- Name: projects trg_projects_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON app.projects FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4196 (class 2620 OID 25523)
-- Name: properties trg_properties_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON app.properties FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4200 (class 2620 OID 25878)
-- Name: property_reservations trg_property_reservations_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_property_reservations_updated_at BEFORE UPDATE ON app.property_reservations FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4193 (class 2620 OID 24604)
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON app.users FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4195 (class 2620 OID 24919)
-- Name: vr_scenes trg_vr_scenes_updated_at; Type: TRIGGER; Schema: app; Owner: postgres
--

CREATE TRIGGER trg_vr_scenes_updated_at BEFORE UPDATE ON app.vr_scenes FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();


--
-- TOC entry 4182 (class 2606 OID 25978)
-- Name: ai_conversations ai_conversations_analytics_session_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_conversations
    ADD CONSTRAINT ai_conversations_analytics_session_id_fkey FOREIGN KEY (analytics_session_id) REFERENCES app.analytics_sessions(id) ON DELETE SET NULL;


--
-- TOC entry 4183 (class 2606 OID 25968)
-- Name: ai_conversations ai_conversations_customer_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_conversations
    ADD CONSTRAINT ai_conversations_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES app.customers(id) ON DELETE SET NULL;


--
-- TOC entry 4184 (class 2606 OID 25973)
-- Name: ai_conversations ai_conversations_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_conversations
    ADD CONSTRAINT ai_conversations_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE SET NULL;


--
-- TOC entry 4185 (class 2606 OID 25963)
-- Name: ai_conversations ai_conversations_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_conversations
    ADD CONSTRAINT ai_conversations_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4190 (class 2606 OID 26033)
-- Name: ai_live_events ai_live_events_ai_live_session_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_live_events
    ADD CONSTRAINT ai_live_events_ai_live_session_id_fkey FOREIGN KEY (ai_live_session_id) REFERENCES app.ai_live_sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4187 (class 2606 OID 26009)
-- Name: ai_live_sessions ai_live_sessions_conversation_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_live_sessions
    ADD CONSTRAINT ai_live_sessions_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES app.ai_conversations(id) ON DELETE CASCADE;


--
-- TOC entry 4188 (class 2606 OID 26014)
-- Name: ai_live_sessions ai_live_sessions_current_panorama_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_live_sessions
    ADD CONSTRAINT ai_live_sessions_current_panorama_id_fkey FOREIGN KEY (current_panorama_id) REFERENCES app.panorama_assets(id) ON DELETE SET NULL;


--
-- TOC entry 4189 (class 2606 OID 26019)
-- Name: ai_live_sessions ai_live_sessions_current_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_live_sessions
    ADD CONSTRAINT ai_live_sessions_current_scene_id_fkey FOREIGN KEY (current_scene_id) REFERENCES app.vr_scenes(id) ON DELETE SET NULL;


--
-- TOC entry 4186 (class 2606 OID 25995)
-- Name: ai_messages ai_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.ai_messages
    ADD CONSTRAINT ai_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES app.ai_conversations(id) ON DELETE CASCADE;


--
-- TOC entry 4119 (class 2606 OID 25356)
-- Name: amenities amenities_amenity_category_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.amenities
    ADD CONSTRAINT amenities_amenity_category_id_fkey FOREIGN KEY (amenity_category_id) REFERENCES app.amenity_categories(id) ON DELETE SET NULL;


--
-- TOC entry 4120 (class 2606 OID 25351)
-- Name: amenities amenities_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.amenities
    ADD CONSTRAINT amenities_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4118 (class 2606 OID 25335)
-- Name: amenity_categories amenity_categories_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.amenity_categories
    ADD CONSTRAINT amenity_categories_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4175 (class 2606 OID 25927)
-- Name: analytics_events analytics_events_customer_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES app.customers(id) ON DELETE SET NULL;


--
-- TOC entry 4176 (class 2606 OID 25932)
-- Name: analytics_events analytics_events_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE SET NULL;


--
-- TOC entry 4177 (class 2606 OID 25947)
-- Name: analytics_events analytics_events_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE SET NULL;


--
-- TOC entry 4178 (class 2606 OID 25937)
-- Name: analytics_events analytics_events_panorama_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_panorama_id_fkey FOREIGN KEY (panorama_id) REFERENCES app.panorama_assets(id) ON DELETE SET NULL;


--
-- TOC entry 4179 (class 2606 OID 25917)
-- Name: analytics_events analytics_events_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4180 (class 2606 OID 25942)
-- Name: analytics_events analytics_events_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES app.vr_scenes(id) ON DELETE SET NULL;


--
-- TOC entry 4181 (class 2606 OID 25922)
-- Name: analytics_events analytics_events_session_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_events
    ADD CONSTRAINT analytics_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES app.analytics_sessions(id) ON DELETE SET NULL;


--
-- TOC entry 4171 (class 2606 OID 25893)
-- Name: analytics_sessions analytics_sessions_customer_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_sessions
    ADD CONSTRAINT analytics_sessions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES app.customers(id) ON DELETE SET NULL;


--
-- TOC entry 4172 (class 2606 OID 25898)
-- Name: analytics_sessions analytics_sessions_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_sessions
    ADD CONSTRAINT analytics_sessions_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE SET NULL;


--
-- TOC entry 4173 (class 2606 OID 25888)
-- Name: analytics_sessions analytics_sessions_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_sessions
    ADD CONSTRAINT analytics_sessions_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4174 (class 2606 OID 25903)
-- Name: analytics_sessions analytics_sessions_sales_public_link_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.analytics_sessions
    ADD CONSTRAINT analytics_sessions_sales_public_link_id_fkey FOREIGN KEY (sales_public_link_id) REFERENCES app.sales_public_links(id) ON DELETE SET NULL;


--
-- TOC entry 4161 (class 2606 OID 25830)
-- Name: appointments appointments_assigned_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.appointments
    ADD CONSTRAINT appointments_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4162 (class 2606 OID 25835)
-- Name: appointments appointments_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.appointments
    ADD CONSTRAINT appointments_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4163 (class 2606 OID 25825)
-- Name: appointments appointments_customer_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.appointments
    ADD CONSTRAINT appointments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES app.customers(id) ON DELETE RESTRICT;


--
-- TOC entry 4164 (class 2606 OID 25820)
-- Name: appointments appointments_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.appointments
    ADD CONSTRAINT appointments_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE SET NULL;


--
-- TOC entry 4165 (class 2606 OID 25815)
-- Name: appointments appointments_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.appointments
    ADD CONSTRAINT appointments_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4060 (class 2606 OID 24649)
-- Name: audit_logs audit_logs_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.audit_logs
    ADD CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4059 (class 2606 OID 24635)
-- Name: auth_sessions auth_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.auth_sessions
    ADD CONSTRAINT auth_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- TOC entry 4125 (class 2606 OID 25429)
-- Name: construction_milestones construction_milestones_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.construction_milestones
    ADD CONSTRAINT construction_milestones_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4086 (class 2606 OID 24988)
-- Name: menu_groups fk_menu_groups_parent_item; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_groups
    ADD CONSTRAINT fk_menu_groups_parent_item FOREIGN KEY (parent_menu_item_id) REFERENCES app.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 4127 (class 2606 OID 25457)
-- Name: floors floors_tower_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.floors
    ADD CONSTRAINT floors_tower_id_fkey FOREIGN KEY (tower_id) REFERENCES app.towers(id) ON DELETE CASCADE;


--
-- TOC entry 4108 (class 2606 OID 25211)
-- Name: gallery_folders gallery_folders_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.gallery_folders
    ADD CONSTRAINT gallery_folders_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4109 (class 2606 OID 25235)
-- Name: gallery_items gallery_items_gallery_folder_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.gallery_items
    ADD CONSTRAINT gallery_items_gallery_folder_id_fkey FOREIGN KEY (gallery_folder_id) REFERENCES app.gallery_folders(id) ON DELETE SET NULL;


--
-- TOC entry 4110 (class 2606 OID 25230)
-- Name: gallery_items gallery_items_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.gallery_items
    ADD CONSTRAINT gallery_items_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4111 (class 2606 OID 25240)
-- Name: gallery_items gallery_items_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.gallery_items
    ADD CONSTRAINT gallery_items_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES app.vr_scenes(id) ON DELETE SET NULL;


--
-- TOC entry 4115 (class 2606 OID 25292)
-- Name: key_visual_groups key_visual_groups_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.key_visual_groups
    ADD CONSTRAINT key_visual_groups_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4116 (class 2606 OID 25309)
-- Name: key_visual_items key_visual_items_key_visual_group_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.key_visual_items
    ADD CONSTRAINT key_visual_items_key_visual_group_id_fkey FOREIGN KEY (key_visual_group_id) REFERENCES app.key_visual_groups(id) ON DELETE CASCADE;


--
-- TOC entry 4191 (class 2606 OID 26087)
-- Name: lead_assignment_counters lead_assignment_counters_last_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_assignment_counters
    ADD CONSTRAINT lead_assignment_counters_last_user_id_fkey FOREIGN KEY (last_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4192 (class 2606 OID 26082)
-- Name: lead_assignment_counters lead_assignment_counters_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_assignment_counters
    ADD CONSTRAINT lead_assignment_counters_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4158 (class 2606 OID 25798)
-- Name: lead_assignments lead_assignments_assigned_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_assignments
    ADD CONSTRAINT lead_assignments_assigned_by_user_id_fkey FOREIGN KEY (assigned_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4159 (class 2606 OID 25788)
-- Name: lead_assignments lead_assignments_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_assignments
    ADD CONSTRAINT lead_assignments_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE CASCADE;


--
-- TOC entry 4160 (class 2606 OID 25793)
-- Name: lead_assignments lead_assignments_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_assignments
    ADD CONSTRAINT lead_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- TOC entry 4155 (class 2606 OID 25757)
-- Name: lead_consents lead_consents_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_consents
    ADD CONSTRAINT lead_consents_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE CASCADE;


--
-- TOC entry 4145 (class 2606 OID 25668)
-- Name: lead_sources lead_sources_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_sources
    ADD CONSTRAINT lead_sources_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4156 (class 2606 OID 25776)
-- Name: lead_status_history lead_status_history_changed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_status_history
    ADD CONSTRAINT lead_status_history_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4157 (class 2606 OID 25771)
-- Name: lead_status_history lead_status_history_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.lead_status_history
    ADD CONSTRAINT lead_status_history_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE CASCADE;


--
-- TOC entry 4148 (class 2606 OID 25726)
-- Name: leads leads_assigned_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4149 (class 2606 OID 25716)
-- Name: leads leads_customer_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES app.customers(id) ON DELETE RESTRICT;


--
-- TOC entry 4150 (class 2606 OID 25736)
-- Name: leads leads_interested_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_interested_property_id_fkey FOREIGN KEY (interested_property_id) REFERENCES app.properties(id) ON DELETE SET NULL;


--
-- TOC entry 4151 (class 2606 OID 25741)
-- Name: leads leads_interested_property_type_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_interested_property_type_id_fkey FOREIGN KEY (interested_property_type_id) REFERENCES app.property_types(id) ON DELETE SET NULL;


--
-- TOC entry 4152 (class 2606 OID 25711)
-- Name: leads leads_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4153 (class 2606 OID 25731)
-- Name: leads leads_sales_public_link_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_sales_public_link_id_fkey FOREIGN KEY (sales_public_link_id) REFERENCES app.sales_public_links(id) ON DELETE SET NULL;


--
-- TOC entry 4154 (class 2606 OID 25721)
-- Name: leads leads_source_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.leads
    ADD CONSTRAINT leads_source_id_fkey FOREIGN KEY (source_id) REFERENCES app.lead_sources(id) ON DELETE SET NULL;


--
-- TOC entry 4121 (class 2606 OID 25371)
-- Name: legal_documents legal_documents_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.legal_documents
    ADD CONSTRAINT legal_documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4103 (class 2606 OID 25143)
-- Name: masterplan_categories masterplan_categories_masterplan_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_categories
    ADD CONSTRAINT masterplan_categories_masterplan_id_fkey FOREIGN KEY (masterplan_id) REFERENCES app.masterplans(id) ON DELETE CASCADE;


--
-- TOC entry 4106 (class 2606 OID 25181)
-- Name: masterplan_filter_groups masterplan_filter_groups_masterplan_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_filter_groups
    ADD CONSTRAINT masterplan_filter_groups_masterplan_id_fkey FOREIGN KEY (masterplan_id) REFERENCES app.masterplans(id) ON DELETE CASCADE;


--
-- TOC entry 4107 (class 2606 OID 25195)
-- Name: masterplan_filter_options masterplan_filter_options_filter_group_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_filter_options
    ADD CONSTRAINT masterplan_filter_options_filter_group_id_fkey FOREIGN KEY (filter_group_id) REFERENCES app.masterplan_filter_groups(id) ON DELETE CASCADE;


--
-- TOC entry 4104 (class 2606 OID 25162)
-- Name: masterplan_markers masterplan_markers_masterplan_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_markers
    ADD CONSTRAINT masterplan_markers_masterplan_id_fkey FOREIGN KEY (masterplan_id) REFERENCES app.masterplans(id) ON DELETE CASCADE;


--
-- TOC entry 4105 (class 2606 OID 25167)
-- Name: masterplan_markers masterplan_markers_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplan_markers
    ADD CONSTRAINT masterplan_markers_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE SET NULL;


--
-- TOC entry 4101 (class 2606 OID 25124)
-- Name: masterplans masterplans_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplans
    ADD CONSTRAINT masterplans_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4102 (class 2606 OID 25129)
-- Name: masterplans masterplans_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.masterplans
    ADD CONSTRAINT masterplans_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4087 (class 2606 OID 24956)
-- Name: menu_groups menu_groups_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_groups
    ADD CONSTRAINT menu_groups_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4092 (class 2606 OID 25014)
-- Name: menu_item_detail_images menu_item_detail_images_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_detail_images
    ADD CONSTRAINT menu_item_detail_images_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 4093 (class 2606 OID 25026)
-- Name: menu_item_detail_specs menu_item_detail_specs_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_detail_specs
    ADD CONSTRAINT menu_item_detail_specs_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 4091 (class 2606 OID 25000)
-- Name: menu_item_details menu_item_details_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_details
    ADD CONSTRAINT menu_item_details_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 4095 (class 2606 OID 25050)
-- Name: menu_item_subdivision_facts menu_item_subdivision_facts_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_subdivision_facts
    ADD CONSTRAINT menu_item_subdivision_facts_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 4096 (class 2606 OID 25064)
-- Name: menu_item_subdivision_points menu_item_subdivision_points_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_subdivision_points
    ADD CONSTRAINT menu_item_subdivision_points_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 4094 (class 2606 OID 25038)
-- Name: menu_item_subdivisions menu_item_subdivisions_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_item_subdivisions
    ADD CONSTRAINT menu_item_subdivisions_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES app.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 4088 (class 2606 OID 24973)
-- Name: menu_items menu_items_menu_group_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_items
    ADD CONSTRAINT menu_items_menu_group_id_fkey FOREIGN KEY (menu_group_id) REFERENCES app.menu_groups(id) ON DELETE CASCADE;


--
-- TOC entry 4089 (class 2606 OID 24978)
-- Name: menu_items menu_items_panorama_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_items
    ADD CONSTRAINT menu_items_panorama_id_fkey FOREIGN KEY (panorama_id) REFERENCES app.panorama_assets(id) ON DELETE SET NULL;


--
-- TOC entry 4090 (class 2606 OID 24983)
-- Name: menu_items menu_items_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.menu_items
    ADD CONSTRAINT menu_items_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES app.vr_scenes(id) ON DELETE SET NULL;


--
-- TOC entry 4124 (class 2606 OID 25414)
-- Name: nearby_places nearby_places_project_location_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.nearby_places
    ADD CONSTRAINT nearby_places_project_location_id_fkey FOREIGN KEY (project_location_id) REFERENCES app.project_locations(id) ON DELETE CASCADE;


--
-- TOC entry 4081 (class 2606 OID 24890)
-- Name: panorama_assets panorama_assets_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.panorama_assets
    ADD CONSTRAINT panorama_assets_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4070 (class 2606 OID 24764)
-- Name: project_card_highlights project_card_highlights_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_card_highlights
    ADD CONSTRAINT project_card_highlights_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4068 (class 2606 OID 24747)
-- Name: project_card_overviews project_card_overviews_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_card_overviews
    ADD CONSTRAINT project_card_overviews_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4069 (class 2606 OID 24752)
-- Name: project_card_overviews project_card_overviews_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_card_overviews
    ADD CONSTRAINT project_card_overviews_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4071 (class 2606 OID 24777)
-- Name: project_card_quick_links project_card_quick_links_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_card_quick_links
    ADD CONSTRAINT project_card_quick_links_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4123 (class 2606 OID 25401)
-- Name: project_locations project_locations_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_locations
    ADD CONSTRAINT project_locations_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4061 (class 2606 OID 24682)
-- Name: project_memberships project_memberships_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_memberships
    ADD CONSTRAINT project_memberships_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4062 (class 2606 OID 24692)
-- Name: project_memberships project_memberships_role_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_memberships
    ADD CONSTRAINT project_memberships_role_id_fkey FOREIGN KEY (role_id) REFERENCES app.roles(id) ON DELETE RESTRICT;


--
-- TOC entry 4063 (class 2606 OID 24687)
-- Name: project_memberships project_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_memberships
    ADD CONSTRAINT project_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- TOC entry 4113 (class 2606 OID 25273)
-- Name: project_resources project_resources_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_resources
    ADD CONSTRAINT project_resources_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4114 (class 2606 OID 25278)
-- Name: project_resources project_resources_resource_category_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_resources
    ADD CONSTRAINT project_resources_resource_category_id_fkey FOREIGN KEY (resource_category_id) REFERENCES app.resource_categories(id) ON DELETE SET NULL;


--
-- TOC entry 4066 (class 2606 OID 24729)
-- Name: project_settings project_settings_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_settings
    ADD CONSTRAINT project_settings_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4067 (class 2606 OID 24734)
-- Name: project_settings project_settings_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_settings
    ADD CONSTRAINT project_settings_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4117 (class 2606 OID 25321)
-- Name: project_statistics project_statistics_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_statistics
    ADD CONSTRAINT project_statistics_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4122 (class 2606 OID 25386)
-- Name: project_testimonials project_testimonials_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_testimonials
    ADD CONSTRAINT project_testimonials_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4078 (class 2606 OID 24867)
-- Name: project_themes project_themes_active_theme_preset_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_themes
    ADD CONSTRAINT project_themes_active_theme_preset_id_fkey FOREIGN KEY (active_theme_preset_id) REFERENCES app.theme_presets(id) ON DELETE SET NULL;


--
-- TOC entry 4079 (class 2606 OID 24862)
-- Name: project_themes project_themes_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_themes
    ADD CONSTRAINT project_themes_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4080 (class 2606 OID 24872)
-- Name: project_themes project_themes_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_themes
    ADD CONSTRAINT project_themes_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4072 (class 2606 OID 24818)
-- Name: project_translations project_translations_language_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_translations
    ADD CONSTRAINT project_translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES app.languages(id) ON DELETE CASCADE;


--
-- TOC entry 4073 (class 2606 OID 24813)
-- Name: project_translations project_translations_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_translations
    ADD CONSTRAINT project_translations_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4074 (class 2606 OID 24823)
-- Name: project_translations project_translations_translation_key_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_translations
    ADD CONSTRAINT project_translations_translation_key_id_fkey FOREIGN KEY (translation_key_id) REFERENCES app.translation_keys(id) ON DELETE CASCADE;


--
-- TOC entry 4075 (class 2606 OID 24828)
-- Name: project_translations project_translations_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_translations
    ADD CONSTRAINT project_translations_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4064 (class 2606 OID 24714)
-- Name: project_versions project_versions_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_versions
    ADD CONSTRAINT project_versions_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4065 (class 2606 OID 24709)
-- Name: project_versions project_versions_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.project_versions
    ADD CONSTRAINT project_versions_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4129 (class 2606 OID 25503)
-- Name: properties properties_floor_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES app.floors(id) ON DELETE SET NULL;


--
-- TOC entry 4130 (class 2606 OID 25493)
-- Name: properties properties_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4131 (class 2606 OID 25508)
-- Name: properties properties_property_type_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_property_type_id_fkey FOREIGN KEY (property_type_id) REFERENCES app.property_types(id) ON DELETE SET NULL;


--
-- TOC entry 4132 (class 2606 OID 25518)
-- Name: properties properties_sales_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_sales_user_id_fkey FOREIGN KEY (sales_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4133 (class 2606 OID 25513)
-- Name: properties properties_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES app.vr_scenes(id) ON DELETE SET NULL;


--
-- TOC entry 4134 (class 2606 OID 25498)
-- Name: properties properties_tower_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.properties
    ADD CONSTRAINT properties_tower_id_fkey FOREIGN KEY (tower_id) REFERENCES app.towers(id) ON DELETE SET NULL;


--
-- TOC entry 4139 (class 2606 OID 25590)
-- Name: property_documents property_documents_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_documents
    ADD CONSTRAINT property_documents_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4136 (class 2606 OID 25547)
-- Name: property_floor_plans property_floor_plans_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_floor_plans
    ADD CONSTRAINT property_floor_plans_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4137 (class 2606 OID 25561)
-- Name: property_highlights property_highlights_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_highlights
    ADD CONSTRAINT property_highlights_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4135 (class 2606 OID 25533)
-- Name: property_images property_images_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_images
    ADD CONSTRAINT property_images_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4140 (class 2606 OID 25603)
-- Name: property_milestones property_milestones_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_milestones
    ADD CONSTRAINT property_milestones_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4138 (class 2606 OID 25575)
-- Name: property_policies property_policies_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_policies
    ADD CONSTRAINT property_policies_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4143 (class 2606 OID 25641)
-- Name: property_price_history property_price_history_changed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_price_history
    ADD CONSTRAINT property_price_history_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4144 (class 2606 OID 25636)
-- Name: property_price_history property_price_history_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_price_history
    ADD CONSTRAINT property_price_history_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4166 (class 2606 OID 25868)
-- Name: property_reservations property_reservations_customer_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_reservations
    ADD CONSTRAINT property_reservations_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES app.customers(id) ON DELETE RESTRICT;


--
-- TOC entry 4167 (class 2606 OID 25863)
-- Name: property_reservations property_reservations_lead_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_reservations
    ADD CONSTRAINT property_reservations_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES app.leads(id) ON DELETE SET NULL;


--
-- TOC entry 4168 (class 2606 OID 25853)
-- Name: property_reservations property_reservations_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_reservations
    ADD CONSTRAINT property_reservations_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4169 (class 2606 OID 25858)
-- Name: property_reservations property_reservations_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_reservations
    ADD CONSTRAINT property_reservations_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE RESTRICT;


--
-- TOC entry 4170 (class 2606 OID 25873)
-- Name: property_reservations property_reservations_sales_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_reservations
    ADD CONSTRAINT property_reservations_sales_user_id_fkey FOREIGN KEY (sales_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4141 (class 2606 OID 25622)
-- Name: property_status_history property_status_history_changed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_status_history
    ADD CONSTRAINT property_status_history_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4142 (class 2606 OID 25617)
-- Name: property_status_history property_status_history_property_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_status_history
    ADD CONSTRAINT property_status_history_property_id_fkey FOREIGN KEY (property_id) REFERENCES app.properties(id) ON DELETE CASCADE;


--
-- TOC entry 4128 (class 2606 OID 25472)
-- Name: property_types property_types_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.property_types
    ADD CONSTRAINT property_types_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4112 (class 2606 OID 25254)
-- Name: resource_categories resource_categories_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.resource_categories
    ADD CONSTRAINT resource_categories_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4146 (class 2606 OID 25685)
-- Name: sales_public_links sales_public_links_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.sales_public_links
    ADD CONSTRAINT sales_public_links_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4147 (class 2606 OID 25690)
-- Name: sales_public_links sales_public_links_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.sales_public_links
    ADD CONSTRAINT sales_public_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- TOC entry 4098 (class 2606 OID 25103)
-- Name: site_map_points site_map_points_panorama_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.site_map_points
    ADD CONSTRAINT site_map_points_panorama_id_fkey FOREIGN KEY (panorama_id) REFERENCES app.panorama_assets(id) ON DELETE SET NULL;


--
-- TOC entry 4099 (class 2606 OID 25108)
-- Name: site_map_points site_map_points_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.site_map_points
    ADD CONSTRAINT site_map_points_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES app.vr_scenes(id) ON DELETE SET NULL;


--
-- TOC entry 4100 (class 2606 OID 25098)
-- Name: site_map_points site_map_points_site_map_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.site_map_points
    ADD CONSTRAINT site_map_points_site_map_id_fkey FOREIGN KEY (site_map_id) REFERENCES app.site_maps(id) ON DELETE CASCADE;


--
-- TOC entry 4097 (class 2606 OID 25079)
-- Name: site_maps site_maps_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.site_maps
    ADD CONSTRAINT site_maps_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4076 (class 2606 OID 24849)
-- Name: theme_presets theme_presets_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.theme_presets
    ADD CONSTRAINT theme_presets_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES app.users(id) ON DELETE SET NULL;


--
-- TOC entry 4077 (class 2606 OID 24844)
-- Name: theme_presets theme_presets_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.theme_presets
    ADD CONSTRAINT theme_presets_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4126 (class 2606 OID 25443)
-- Name: towers towers_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.towers
    ADD CONSTRAINT towers_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4057 (class 2606 OID 24619)
-- Name: user_role_bindings user_role_bindings_role_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.user_role_bindings
    ADD CONSTRAINT user_role_bindings_role_id_fkey FOREIGN KEY (role_id) REFERENCES app.roles(id) ON DELETE RESTRICT;


--
-- TOC entry 4058 (class 2606 OID 24614)
-- Name: user_role_bindings user_role_bindings_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.user_role_bindings
    ADD CONSTRAINT user_role_bindings_user_id_fkey FOREIGN KEY (user_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- TOC entry 4084 (class 2606 OID 24935)
-- Name: vr_hotspots vr_hotspots_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_hotspots
    ADD CONSTRAINT vr_hotspots_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES app.vr_scenes(id) ON DELETE CASCADE;


--
-- TOC entry 4085 (class 2606 OID 24940)
-- Name: vr_hotspots vr_hotspots_target_scene_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_hotspots
    ADD CONSTRAINT vr_hotspots_target_scene_id_fkey FOREIGN KEY (target_scene_id) REFERENCES app.vr_scenes(id) ON DELETE SET NULL;


--
-- TOC entry 4082 (class 2606 OID 24914)
-- Name: vr_scenes vr_scenes_panorama_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_scenes
    ADD CONSTRAINT vr_scenes_panorama_id_fkey FOREIGN KEY (panorama_id) REFERENCES app.panorama_assets(id) ON DELETE SET NULL;


--
-- TOC entry 4083 (class 2606 OID 24909)
-- Name: vr_scenes vr_scenes_project_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.vr_scenes
    ADD CONSTRAINT vr_scenes_project_id_fkey FOREIGN KEY (project_id) REFERENCES app.projects(id) ON DELETE CASCADE;


-- Completed on 2026-05-22 14:49:55

--
-- PostgreSQL database dump complete
--

\unrestrict 3tjHiK01pEaaSrVSIIurFDmDLFoH2ItSQK6SyBpsoYiPMHfFr9b8DDI6VpJf7J1

