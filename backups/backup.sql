PGDMP                      |           postgres    16.4    16.4 8    ]           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ^           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            _           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            `           1262    5    postgres    DATABASE     j   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE postgres;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            f           1247    16661    product_discount    TYPE     i   CREATE TYPE public.product_discount AS (
	productid integer,
	amount numeric,
	discountamount numeric
);
 #   DROP TYPE public.product_discount;
       public          postgres    false    5            �            1255    16655    search_products(text)    FUNCTION     �  CREATE FUNCTION public.search_products(userinput text) RETURNS TABLE(productid integer, barcode character varying, productname character varying, description text, quantityperunit integer, price numeric, category character varying, color character varying, size character varying, imageurl character varying, note text, product_available boolean, createddate timestamp without time zone, updateddate timestamp without time zone)
    LANGUAGE plpgsql
    AS '
BEGIN
    IF userInput IS NULL OR TRIM(userInput) = '''' THEN
        -- Return all products if no input is provided
        RETURN QUERY 
        SELECT  
            p.productid, p.barcode, p.productname, p.description, p.quantityperunit, p.price, 
            p.category, p.color, p.size, p.imageurl, p.note, p.product_available, 
            p.createddate, p.updateddate
        FROM products p;
    ELSE
        RETURN QUERY
        SELECT   
            p.productid, p.barcode, p.productname, p.description, p.quantityperunit, p.price, 
            p.category, p.color, p.size, p.imageurl, p.note, p.product_available, 
            p.createddate, p.updateddate
        FROM products p
        WHERE 
            (userInput ~ ''^\d+$'' AND LENGTH(userInput) <= 10 AND p.productid = userInput::INT)
            OR (userInput ~ ''^\d+$'' AND LENGTH(userInput) > 10 AND p.barcode = userInput)
            OR (userInput !~ ''^\d+$'' AND tRIM(p.productname) ILIKE ''%'' || userInput || ''%'');
    END IF;
END;
';
 6   DROP FUNCTION public.search_products(userinput text);
       public          postgres    false    5            �            1259    16674    category    TABLE     \   CREATE TABLE public.category (
    name character varying(150),
    "categoryId" integer
);
    DROP TABLE public.category;
       public         heap    postgres    false    5            �            1259    16663    discount    TABLE       CREATE TABLE public.discount (
    discountid integer NOT NULL,
    products_discount public.product_discount[],
    productname character varying,
    offer text,
    startdate timestamp without time zone,
    enddate timestamp without time zone,
    userid integer,
    condition text,
    offer_name character varying NOT NULL,
    createddate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updateddate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usageforcustmer integer DEFAULT 0
);
    DROP TABLE public.discount;
       public         heap    postgres    false    5    870            �            1259    16662    discount_discountid_seq    SEQUENCE     �   CREATE SEQUENCE public.discount_discountid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.discount_discountid_seq;
       public          postgres    false    228    5            a           0    0    discount_discountid_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.discount_discountid_seq OWNED BY public.discount.discountid;
          public          postgres    false    227            �            1259    16561    inventorytransaction    TABLE     -  CREATE TABLE public.inventorytransaction (
    inventoryorderid integer NOT NULL,
    orderid integer,
    transactiontype smallint,
    supplierid integer,
    customerid integer,
    price numeric(10,2),
    transactiondate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    crdb integer
);
 (   DROP TABLE public.inventorytransaction;
       public         heap    postgres    false    5            �            1259    16560 )   inventorytransaction_inventoryorderid_seq    SEQUENCE     �   CREATE SEQUENCE public.inventorytransaction_inventoryorderid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 @   DROP SEQUENCE public.inventorytransaction_inventoryorderid_seq;
       public          postgres    false    5    223            b           0    0 )   inventorytransaction_inventoryorderid_seq    SEQUENCE OWNED BY     w   ALTER SEQUENCE public.inventorytransaction_inventoryorderid_seq OWNED BY public.inventorytransaction.inventoryorderid;
          public          postgres    false    222            �            1259    16508    orders    TABLE     5  CREATE TABLE public.orders (
    orderid integer NOT NULL,
    customerid integer,
    customername character varying(100),
    discount numeric(5,2) DEFAULT 0.00,
    ordernumber character varying(50),
    orderdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    salestax numeric(5,2) DEFAULT 0.00,
    price numeric(10,2),
    paymentmethod character varying(50),
    paymentdate timestamp without time zone,
    status character varying(50) DEFAULT 'PENDING'::character varying,
    type smallint,
    note text,
    printed boolean DEFAULT false
);
    DROP TABLE public.orders;
       public         heap    postgres    false    5            �            1259    16507    orders_orderid_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_orderid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.orders_orderid_seq;
       public          postgres    false    219    5            c           0    0    orders_orderid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.orders_orderid_seq OWNED BY public.orders.orderid;
          public          postgres    false    218            �            1259    16536    ordersstock    TABLE       CREATE TABLE public.ordersstock (
    orderstockid integer NOT NULL,
    orderid integer,
    productid integer,
    productname character varying(100),
    quantityordered integer,
    unitprice numeric(10,2),
    discount numeric(5,2) DEFAULT 0.00,
    supplierid integer,
    selectedcolor character varying(50),
    selectedsize character varying(50),
    price numeric(10,2),
    status character varying(50),
    barcode character varying(100),
    type character varying(100),
    orderdate date,
    expirydate date
);
    DROP TABLE public.ordersstock;
       public         heap    postgres    false    5            �            1259    16535    orderstock_orderstockid_seq    SEQUENCE     �   CREATE SEQUENCE public.orderstock_orderstockid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.orderstock_orderstockid_seq;
       public          postgres    false    221    5            d           0    0    orderstock_orderstockid_seq    SEQUENCE OWNED BY     \   ALTER SEQUENCE public.orderstock_orderstockid_seq OWNED BY public.ordersstock.orderstockid;
          public          postgres    false    220            �            1259    16433    products    TABLE     H  CREATE TABLE public.products (
    productid integer NOT NULL,
    barcode character varying(100) NOT NULL,
    productname character varying(255) NOT NULL,
    description text,
    quantityperunit integer,
    price numeric(10,2) NOT NULL,
    category character varying(255),
    color character varying(50),
    size character varying(50),
    imageurl character varying(255),
    note text,
    product_available boolean DEFAULT true,
    createddate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updateddate timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.products;
       public         heap    postgres    false    5            �            1259    16432    products_productid_seq    SEQUENCE     �   CREATE SEQUENCE public.products_productid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.products_productid_seq;
       public          postgres    false    217    5            e           0    0    products_productid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.products_productid_seq OWNED BY public.products.productid;
          public          postgres    false    216            �            1259    16609    users    TABLE     3  CREATE TABLE public.users (
    userid integer NOT NULL,
    role character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    companyname character varying(255),
    contacttitle character varying(255),
    address1 character varying(255),
    city character varying(255),
    state character varying(255),
    country character varying(255),
    phone character varying(20),
    fax character varying(20),
    email character varying(255),
    url character varying(255),
    paymentmethods text[],
    notes text,
    logourl text,
    activestatus boolean,
    passwoord character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['customer'::character varying, 'supplier'::character varying, 'admin'::character varying, 'employee'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap    postgres    false    5            �            1259    16608    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    225    5            f           0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    224            �           2604    16666    discount discountid    DEFAULT     z   ALTER TABLE ONLY public.discount ALTER COLUMN discountid SET DEFAULT nextval('public.discount_discountid_seq'::regclass);
 B   ALTER TABLE public.discount ALTER COLUMN discountid DROP DEFAULT;
       public          postgres    false    227    228    228            �           2604    16564 %   inventorytransaction inventoryorderid    DEFAULT     �   ALTER TABLE ONLY public.inventorytransaction ALTER COLUMN inventoryorderid SET DEFAULT nextval('public.inventorytransaction_inventoryorderid_seq'::regclass);
 T   ALTER TABLE public.inventorytransaction ALTER COLUMN inventoryorderid DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    16511    orders orderid    DEFAULT     p   ALTER TABLE ONLY public.orders ALTER COLUMN orderid SET DEFAULT nextval('public.orders_orderid_seq'::regclass);
 =   ALTER TABLE public.orders ALTER COLUMN orderid DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    16539    ordersstock orderstockid    DEFAULT     �   ALTER TABLE ONLY public.ordersstock ALTER COLUMN orderstockid SET DEFAULT nextval('public.orderstock_orderstockid_seq'::regclass);
 G   ALTER TABLE public.ordersstock ALTER COLUMN orderstockid DROP DEFAULT;
       public          postgres    false    221    220    221            �           2604    16436    products productid    DEFAULT     x   ALTER TABLE ONLY public.products ALTER COLUMN productid SET DEFAULT nextval('public.products_productid_seq'::regclass);
 A   ALTER TABLE public.products ALTER COLUMN productid DROP DEFAULT;
       public          postgres    false    216    217    217            �           2604    16612    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    224    225    225            Z          0    16674    category 
   TABLE DATA                 public          postgres    false    229   �K       Y          0    16663    discount 
   TABLE DATA                 public          postgres    false    228   L       U          0    16561    inventorytransaction 
   TABLE DATA                 public          postgres    false    223   QM       Q          0    16508    orders 
   TABLE DATA                 public          postgres    false    219   N       S          0    16536    ordersstock 
   TABLE DATA                 public          postgres    false    221   �P       O          0    16433    products 
   TABLE DATA                 public          postgres    false    217   �R       W          0    16609    users 
   TABLE DATA                 public          postgres    false    225   �U       g           0    0    discount_discountid_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.discount_discountid_seq', 1, false);
          public          postgres    false    227            h           0    0 )   inventorytransaction_inventoryorderid_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.inventorytransaction_inventoryorderid_seq', 1, false);
          public          postgres    false    222            i           0    0    orders_orderid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.orders_orderid_seq', 1, true);
          public          postgres    false    218            j           0    0    orderstock_orderstockid_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.orderstock_orderstockid_seq', 1, false);
          public          postgres    false    220            k           0    0    products_productid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.products_productid_seq', 1, false);
          public          postgres    false    216            l           0    0    users_userid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_userid_seq', 4, true);
          public          postgres    false    224            �           2606    16673    discount discount_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (discountid);
 @   ALTER TABLE ONLY public.discount DROP CONSTRAINT discount_pkey;
       public            postgres    false    228            �           2606    16569 .   inventorytransaction inventorytransaction_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.inventorytransaction
    ADD CONSTRAINT inventorytransaction_pkey PRIMARY KEY (inventoryorderid);
 X   ALTER TABLE ONLY public.inventorytransaction DROP CONSTRAINT inventorytransaction_pkey;
       public            postgres    false    223            �           2606    16526    orders orders_ordernumber_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_ordernumber_key UNIQUE (ordernumber);
 G   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_ordernumber_key;
       public            postgres    false    219            �           2606    16524    orders orders_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (orderid);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    219            �           2606    16544    ordersstock orderstock_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.ordersstock
    ADD CONSTRAINT orderstock_pkey PRIMARY KEY (orderstockid);
 E   ALTER TABLE ONLY public.ordersstock DROP CONSTRAINT orderstock_pkey;
       public            postgres    false    221            �           2606    16447    products products_barcode_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_barcode_key UNIQUE (barcode);
 G   ALTER TABLE ONLY public.products DROP CONSTRAINT products_barcode_key;
       public            postgres    false    217            �           2606    16443    products products_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (productid);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    217            �           2606    16588    orders unique_type_orderid 
   CONSTRAINT     ^   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT unique_type_orderid UNIQUE (type, orderid);
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT unique_type_orderid;
       public            postgres    false    219    219            �           2606    16619    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    225            �           2606    16617    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    225            �           2606    16572 6   inventorytransaction inventorytransaction_orderid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.inventorytransaction
    ADD CONSTRAINT inventorytransaction_orderid_fkey FOREIGN KEY (orderid) REFERENCES public.orders(orderid);
 `   ALTER TABLE ONLY public.inventorytransaction DROP CONSTRAINT inventorytransaction_orderid_fkey;
       public          postgres    false    219    223    3505            Z   w   x���v
Q���W((M��L�KN,IM�/�T��K�M�QP�	x�(i*�9���+h�������(j*��)8����x:�(��+���xx��[sy�m�G~n����{bQJj�,1�m	 DEWZ      Y   %  x��_k�0����¨BZ�¶�ѵ��EX�^K��]@MI���w��u(�}(�នsO ��nO9�4��P��O��\ו���@p0Z���mg~Y+%��I��:f�`�qd%NCm�i+���rJW����ɍlb]� z²��i�k�Jix�[?/6��0B0~��(DO1F��	"(>ʏq��k]����t�$��}�C�&�zB���x�v��6inU�ʺl���7feS!('K�..YQ��rP[>�� 2
�.��<��h�?�tu��l�����'��0�L���x�'��      U   �   x�U��
�@E�~�۩0�ӌ�VaV��@��ut1`:�c��WR�{/瞌�CF95՝��mo=]�c%�zpV:�ղ!���̪%0NJur9�4��l��h���2o tS�p?�eZ���oo�G$`�F�pAo0F�	�2�]`F�y�p81��_3z9X��f�Fz      Q   �  x���Mo�0�{?�o�R@�g;M�ۘP2�t�)M\)$(v���g�a�4�a�#E��Ǽ�D�����v���<F��!_����d��es��<��J����E���*-�B{�).�僬v�,ѦB%�T:��U�HM�*Y/e��R?��KsW�]+��ʴ�r�g�ZfW�ۇ����$�x�l�/�S��K9�alz��kB��q�5��C,�t�H�c����J��vĤ��B�IRe���wc�r�ʥy�1ܼt���(}�F�NS��c��kS��Z^�8B�8�8�N��:FQ<�<�>����{�.��1y8y=�c��7%����5�[<��O�����Az�5���H=-VFW�7���cƝ���X�qg��a�q���Ȍ rwd�:�Q@�L�> wGv��X �ݑ2,�{@fdX%���"���_�<v C��������c@�L��C��ّ�8$����C��ّ�8$����C���$��~6{��/�~�����߂��'9���S��=o�rl�(#([P
%�P��m�(	� �F��$�/�lCIm���H���m�c�s8���'ƹ ���U�B�)[H֙R��I@@�����2�>���+#P���N�Ƈ�@y��ٗB��#rRr��?���\l����e�o�]\�j:      S   �  x���Ok�0 �{>�nn�	�Ħ�-M3�gC�n��J"u-M�a٧�$'MK�0zQ�t��l�������yYW�w-E3&0}/z gc�c�}`2p���䳰k�~M'�ܙ�DU��J.(R5L{ĆN��8o�x���I�k�8�=�E��͕�l�����a5!w��n�
�ON�N���ۧ�f�g���H�w��DzzN}�T_�8��5����S���S��tyS��sP�`Y�WE���eʪ����I��.��ђ�Jz�f�_���z��5]�a'�E�� ҹ ۡm�C�S�Ma�ϒ}�_��G�ddo��9i�=��dO�5��fD��=�_�g�b��Q�,u�'�#��o���JP��vj&���A:˲CO����ւ���Fl��qɋMPg_=j�n�M8���G�yo�����g p��?t�6�#�o�?q��C�|���c�?��;��п���z������ɷD���}��m����O&�9a�      O   �  x�ݕ]o�0���+��F+�4vH������ֲ�rr7x�8s:��w���I��U��>�>�y^3�>^?�a<�Ϡ����~itVs[�i7�Y���:}�b[�$7��R}�^��J�)��i�R�qgV��lp��6}��O��EmT
mw���5��=)��ܛe���2�N�������#�� �C��0��$H���H��^B]��Zớ`���q��֪Y� 2�5qkˋ�s�J%|�W�/2˅����[�A��bX�A�=��b�	kj<h�4��z��8��$�����̦0�Mo&����`:�ߍ���N��7�0 c�N�;m�K#�_�Z�a���#�	P�ೣ�xt �t�W��1��&�A��iҹH�-���FGYzͬ\ȷh���k%�5�np])Ɨnp X[c�JT*��0�"p��x+��	/�ADa�x����B~h/�׈hd��0A����&�x[�"wg^�jS�/�i��q%�-"7�(ܮ/�<Z����\�-����v��h�f
�9�ѝ�Fi��Ÿ˾b�C켽ۋ�)q���3�0n���|��& �����YwUR�|ɹ�*m��[�6��q{ cW��%z���T�{e&֨Gug8ě`�h/�]��L��%ު��Ɔ\{7����5׃�+W��.K�O�l�Q����ğ��iq�֠� MWd��e��^	�7`�p%2Xᙍd��(��iB{I�Nyr��4�      W   E  x��Q�n�0��V/�TM�v܉ueT��	��YFD�T�������Đ�v��~v�c?�`�|YC��
��֪�&x�<L�)����L�pmcu�����B"p!���6�R�ȱ'�.��֚o�>��jS.���4�%n��E]k�m�;�I�Ol�?�ub
��r��`;�}�VI7�x��\�B��F�WǷl��w���������8~O"}b�@��D��=���X/Kr_I�Pw"I�GnvP;n�F��(��(�¡���r�S�d��EV�S��{~��N�Qs<Z}�N�%������;���|^1� �Z�h�DD�     