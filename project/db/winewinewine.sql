--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: wine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wine (
    "red/white" character(100),
    "이름" character(100),
    "생산지" character(100),
    "포도 품종" character(100),
    "알코올 도수" character(100),
    "어울리는 음식" character(100)
);


ALTER TABLE public.wine OWNER TO postgres;

--
-- Data for Name: wine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wine ("red/white", "이름", "생산지", "포도 품종", "알코올 도수", "어울리는 음식") FROM stdin;
red                                                                                                 	구스타브 로렌츠 피노 누아 리저브                                                                                  	프랑스/알자스                                                                                             	피노 누아                                                                                               	12.5%                                                                                               	붉은 고기                                                                                               
red                                                                                                 	그란데 알베로네 퀸투스                                                                                        	이탈리아                                                                                                	메를르                                                                                                 	14.5%                                                                                               	스튜                                                                                                  
white                                                                                               	로쉐마제 샤르도네                                                                                           	프랑스/랑그독                                                                                             	샤르도네                                                                                                	12.5%                                                                                               	파스타                                                                                                 
white                                                                                               	파밀리아 마로네 랑게 샤도네이                                                                                    	이탈리아                                                                                                	샤르도네                                                                                                	13.5%                                                                                               	파스타                                                                                                 
\.


--
-- PostgreSQL database dump complete
--

