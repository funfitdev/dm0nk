--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: note_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.note_type AS ENUM (
    'text',
    'markdown',
    'birthdays',
    'spaced_rep_suite',
    'checklist',
    'trip',
    'journal',
    'bookmarks'
);


ALTER TYPE public.note_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    type public.note_type DEFAULT 'text'::public.note_type NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- Name: recordings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recordings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    filename character varying(255) NOT NULL,
    original_filename character varying(255),
    file_size bigint,
    duration integer DEFAULT 0,
    mime_type character varying(100) DEFAULT 'audio/wav'::character varying,
    file_path text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.recordings OWNER TO postgres;

--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO postgres;

--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: recordings recordings_filename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordings
    ADD CONSTRAINT recordings_filename_key UNIQUE (filename);


--
-- Name: recordings recordings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordings
    ADD CONSTRAINT recordings_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: idx_notes_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notes_created_at ON public.notes USING btree (created_at DESC);


--
-- Name: idx_notes_data_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notes_data_gin ON public.notes USING gin (data);


--
-- Name: idx_notes_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notes_type ON public.notes USING btree (type);


--
-- Name: idx_recordings_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recordings_created_at ON public.recordings USING btree (created_at DESC);


--
-- Name: idx_recordings_filename; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recordings_filename ON public.recordings USING btree (filename);


--
-- PostgreSQL database dump complete
--

